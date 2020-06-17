import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { createSchema } from "../modules/create-schema";
import { fakeUser } from "./fake-user";

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

  const user = {
    ...fakeUser,
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
    },
    variableValues
  );
};