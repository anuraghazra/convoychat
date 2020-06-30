import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloLink, split } from "apollo-link";
import { createUploadLink } from 'apollo-upload-client'

import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { toast } from "@convoy-ui";

const uploadLink = createUploadLink({
  uri: "/graphql",
  credentials: "include"
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/subscriptions`,
  options: {
    lazy: true,
    reconnect: true,
  },
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  uploadLink,
);

const client = new ApolloClient({
  connectToDevTools: true,
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
          toast.error(message)
        );
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
        toast.error(networkError?.message)
      }
    }),
    link,
  ]),
  cache: new InMemoryCache(),
});

export default client;
