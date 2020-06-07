const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar JSON
  scalar JSONObject

  type User {
    id: ID!
    name: String!
    username: String!
    rooms: [Room!]!
    createdAt: String!
  }

  type Message {
    id: ID!
    roomId: ID!
    author: Member!
    content: String!
    createdAt: String!
  }

  # lets add a Member with rooms: ID to avoid recursion
  type Member {
    id: ID!
    name: String!
    avatarUrl: String
    username: String!
    rooms: [ID!]!
    createdAt: String!
  }

  type Room {
    id: ID!
    name: String!
    members: [Member!]!
    messages: [Message!]!
    createdAt: String!
    owner: ID!
  }

  type Me {
    id: ID!
    name: String!
    email: String!
    username: String!
    rooms: [Room!]!
    avatarUrl: String
  }

  type Messages {
    totalDocs: Int
    totalPages: Int
    messages: [Message!]!
  }

  type Invitation {
    id: ID!
    roomId: ID!
    userId: ID!
    invitedBy: ID!
    isPublic: Boolean!
    createdAt: String!
  }

  type InvitationLinkResult {
    link: String!
  }

  type InvitationDetails {
    id: ID!
    room: Room
    invitedBy: Member!
    isPublic: Boolean!
    createdAt: String!
  }

  enum NOTIFICATION_TYPES {
    INVITATION
    MENTION
  }
  type Notification {
    id: ID!
    author: ID!
    type: NOTIFICATION_TYPES!
    payload: JSONObject
  }

  type Query {
    me: Me!
    listUsers: [User!]!
    listRooms: [Room!]!
    listCurrentUserRooms: [Room]!
    getMessages(roomId: ID!, offset: Int!, limit: Int!): Messages
    getNotifications: [Notification]!
    getUser(id: ID!): User!
    getRoom(id: ID!): Room!
    getInvitationInfo(token: String!): InvitationDetails!
  }

  type Mutation {
    createRoom(name: String!): Room!
    addMembersToRoom(roomId: ID!, members: [ID!]!): Room!
    removeMemberFromRoom(roomId: ID!, memberId: ID!): Member!
    deleteRoom(roomId: ID!): Room
    sendMessage(roomId: ID!, content: String!): Message!
    deleteMessage(messageId: ID!): Message!
    editMessage(messageId: ID!, content: String!): Message!
    inviteMembers(roomId: ID!, members: [ID!]!): [Invitation!]!
    acceptInvitation(token: String!): Boolean
    createInvitationLink(roomId: ID!): InvitationLinkResult!
    logout: Boolean
  }

  type Subscription {
    onNewMessage(roomId: ID!): Message!
    onDeleteMessage(roomId: ID!): Message!
    onUpdateMessage(roomId: ID!): Message!
  }
`;

module.exports = typeDefs;
