import { AuthChecker } from "type-graphql";
import { Context } from "../modules/context.type";
import { AuthenticationError } from "apollo-server-express";

const useAuth: AuthChecker<Context> = (
  { root, args, context, info },
  _roles
) => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
  if (!context.getUser()) {
    throw new AuthenticationError("User not authenticated");
  }
  return true;
};
export default useAuth;
