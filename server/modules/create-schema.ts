import { buildSchema } from "type-graphql";
import useAuth from "../utils/auth-checker";
import { TypegooseMiddleware } from "../utils/typegoose-middleware";
import { ObjectID } from "mongodb";

import UserResolver from "./user/user-resolver";
import RoomResolver from "./room/room-resolver";
import MessageResolver from "./message/message-resolver";
import NotificationResolver from "./notification/notification-resolver";
import InvitationResolver from "./invitation/invitation-resolver";
import MessageSubscriptions from "./message/message-subscriptions";
import NotificationsSubscriptions from "./notification/notification-subscriptions";
import { ObjectIdScalar } from "../utils/objectid-scalar";

export const createSchema = () => {
  return buildSchema({
    resolvers: [
      RoomResolver,
      UserResolver,
      MessageResolver,
      InvitationResolver,
      NotificationResolver,
      MessageSubscriptions,
      NotificationsSubscriptions,
    ],
    globalMiddlewares: [TypegooseMiddleware],
    scalarsMap: [{ type: ObjectID, scalar: ObjectIdScalar }],
    authChecker: useAuth,
  });
};
