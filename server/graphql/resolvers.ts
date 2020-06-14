import { GraphQLJSON, GraphQLJSONObject } from "graphql-type-json";
import * as RoomController from "../controllers/RoomController";
import * as UserController from "../controllers/UserController";
import * as InvitationController from "../controllers/InvitationController";
import MessageSubscriptions from "../controllers/MessageSubscriptions";
import { NEW_NOTIFICATION } from "../constants";
import { withFilter, IResolvers } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";

import useAuth from "../utils/useAuth";

const filterUser = (argName: string) => (payload, variables, context) => {
  return payload[argName].receiver.toString() === context.currentUser.id;
};

type ResolverFn = IResolvers<any, any>;
interface ResolverMap {
  [field: string]: any;
}
interface Resolvers {
  JSON: any;
  JSONObject: any;
  Subscription: ResolverMap,
  Query: ResolverMap;
  Mutation: ResolverMap;
}

const resolvers: Resolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  Subscription: {
    onNewMessage: MessageSubscriptions.onNewMessage,
    onDeleteMessage: MessageSubscriptions.onDeleteMessage,
    onUpdateMessage: MessageSubscriptions.onUpdateMessage,
    onNewNotification: {
      subscribe: withFilter((_parent, _args, context) => {
        return context.pubsub.asyncIterator([NEW_NOTIFICATION]);
      }, filterUser("onNewNotification")),
    },
  },
  Query: {
    me: UserController.me,
    listUsers: useAuth(UserController.listUsers),
    getUser: useAuth(UserController.getUser),
    listRooms: useAuth(RoomController.listRooms),
    listCurrentUserRooms: useAuth(RoomController.listCurrentUserRooms),
    getRoom: useAuth(RoomController.getRoom),
    getMessages: useAuth(RoomController.getMessages),
    getNotifications: useAuth(UserController.getNotifications),
    getInvitationInfo: useAuth(InvitationController.getInvitationInfo),
  },
  Mutation: {
    createRoom: useAuth(RoomController.createRoom),
    deleteRoom: useAuth(RoomController.deleteRoom),
    addMembersToRoom: useAuth(RoomController.addMembersToRoom),
    removeMemberFromRoom: useAuth(RoomController.removeMemberFromRoom),
    sendMessage: useAuth(UserController.sendMessage),
    deleteMessage: useAuth(UserController.deleteMessage),
    editMessage: useAuth(UserController.editMessage),
    readNotification: useAuth(UserController.readNotification),
    inviteMembers: useAuth(InvitationController.inviteMembers),
    acceptInvitation: useAuth(InvitationController.acceptInvitation),
    createInvitationLink: useAuth(InvitationController.createInvitationLink),
    logout: (_parent, _args, context) => {
      const { req } = context;
      req.logout();
      return true;
    },
  },
};

export default resolvers;
