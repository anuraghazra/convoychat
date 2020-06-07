const { GraphQLJSON, GraphQLJSONObject } = require("graphql-type-json");
const RoomController = require("../controllers/RoomController");
const UserController = require("../controllers/UserController");
const InvitationController = require("../controllers/InvitationController");
const MessageSubscriptions = require("../controllers/MessageSubscriptions");

const useAuth = require("../utils/useAuth");

const resolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  Subscription: {
    onNewMessage: MessageSubscriptions.onNewMessage,
    onDeleteMessage: MessageSubscriptions.onDeleteMessage,
    onUpdateMessage: MessageSubscriptions.onUpdateMessage,
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

module.exports = resolvers;
