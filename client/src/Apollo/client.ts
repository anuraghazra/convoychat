import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: "/graphql",
  credentials: "include",
})

export default client