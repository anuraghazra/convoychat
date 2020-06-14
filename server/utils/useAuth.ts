import { AuthenticationError, ResolverFn } from "apollo-server-express";

const useAuth = (next: any) => (root, args, context, info) => {
  if (!context.getUser()) {
    throw new AuthenticationError("User not authenticated");
  }
  return next(root, args, context, info);
};

export default useAuth
