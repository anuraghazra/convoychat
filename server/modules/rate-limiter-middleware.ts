import { MiddlewareFn } from "type-graphql";
import { getGraphQLRateLimiter } from "graphql-rate-limit";


const limiter = getGraphQLRateLimiter({
  formatError: () => "haha got you! i have rate limiter set. try again after 25mins",
  identifyContext: ctx => ctx.currentUser.username,
});


interface IRateLimit { limit?: number, window?: string }

const RateLimit = ({ limit = 50, window = "25min" }: IRateLimit = {}): MiddlewareFn<any> => {
  return async ({ root: parent, args, context, info }, next) => {
    const error = await limiter({
      parent,
      args,
      context,
      info
    }, {
      max: limit,
      window: window
    });

    if (error) throw new Error(error);

    return next();
  };
};

export default RateLimit;