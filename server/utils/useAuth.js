const { AuthenticationError } = require("apollo-server-express");

const useAuth = (next) => (root, args, context, info) => {
  if (!context.getUser()) {
    throw new AuthenticationError("User not authenticated");
  }
  return next(root, args, context, info);
};

module.exports = useAuth;
