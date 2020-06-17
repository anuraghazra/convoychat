import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { createSchema } from "../modules/create-schema";
import fakeUser from "./fake-user";

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues }: Options) => {
  if (!schema) {
    schema = await createSchema();
  }
  return graphql(
    schema,
    source,
    undefined,
    {
      currentUser: {
        ...fakeUser
      },
      getUser: () => fakeUser,
      logout: () => { },
      req: {
        user: fakeUser,
      },
      res: {},
    },
    variableValues
  );
};