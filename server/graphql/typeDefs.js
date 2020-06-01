const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
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

  type Query {
    me: Me!
    listUsers: [User!]!
    listRooms: [Room!]!
    listCurrentUserRooms: [Room]!
    getUser(id: ID!): User!
    getRoom(id: ID!): Room!
  }

  type Mutation {
    createRoom(name: String!): Room!
    addMembersToRoom(roomId: ID!, members: [ID!]!): Room!
    deleteRoom(roomId: ID!): Room
    sendMessage(roomId: ID!, content: String!): Message!
    logout: Boolean
  }

  type Subscription {
    newMessage(roomId: ID!): Message!
  }
`;

module.exports = typeDefs;
