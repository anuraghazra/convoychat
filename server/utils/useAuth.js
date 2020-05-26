const useAuth = (next) => (root, args, context, info) => {
  if (!context.currentUser) {
    throw new AuthenticationError("User not authenticated");
  }
  return next(root, args, context, info);
};

module.exports = useAuth;
