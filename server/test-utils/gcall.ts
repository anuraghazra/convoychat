import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { createSchema } from "../modules/create-schema";
import { fakeUser } from "./fake-user";
import { User } from "../entities/User";
import { PubSub } from "apollo-server-express";

interface Options {
  source: string;
  currentUser?: any,
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues, currentUser }: Options) => {
  if (!schema) {
    schema = await createSchema();
  }
  let user = {
    ...fakeUser,
  }

  if (currentUser) {
    user = {
      ...currentUser,
      id: currentUser._id,
    };
  }

  return graphql(
    schema,
    source,
    undefined,
    {
      currentUser: {
        ...user
      },
      getUser: () => user,
      logout: () => { },
      req: {
        user: user
      },
      res: {},
      pubsub: new PubSub(),
    },
    variableValues
  );
};