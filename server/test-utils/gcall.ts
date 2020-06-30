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

export const createFakeContext = (currentUser?: any) => {
  let user = {
    ...fakeUser,
  };

  if (currentUser) {
    user = {
      ...currentUser,
      id: currentUser._id,
    };
  }
  return {
    currentUser: {
      ...user
    },
    getUser: () => user,
    logout: () => { },
    logOut: () => { },
    isAuthenticated: () => true,
    isUnauthenticated: () => false,
    authenticate: () => user,
    login: () => true,
    req: {
      user: user
    },
    res: {} as any,
    pubsub: new PubSub(),
  };
};

export const gCall = async ({ source, variableValues, currentUser }: Options) => {
  if (!schema) {
    schema = await createSchema();
  }

  return graphql(
    schema,
    source,
    undefined,
    createFakeContext(currentUser),
    variableValues
  );
};