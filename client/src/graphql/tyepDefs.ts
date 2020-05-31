import gql from "graphql-tag";

const CURRENT_USER = gql`
  query currentUser {
    me {
      id
      name
      email
      username
      avatarUrl
      rooms {
        id
        name
        owner
      }
    }
  }
`;

const LOGOUT = gql`
  mutation logout {
    logout
  }
`;

const GET_ROOM = gql`
  query getRoom($roomId: ID!) {
    getRoom(id: $roomId) {
      id
      name
      members {
        username
        name
        avatarUrl
        createdAt
        id
      }
      messages {
        id
        content
        roomId
        author {
          name
          username
          avatarUrl
          createdAt
        }
      }
      createdAt
      owner
    }
  }
`;

const LIST_USERS = gql`
  query ListUsers {
    listUsers {
      username
      id
      rooms {
        id
      }
    }
  }
`;

const LIST_ROOMS = gql`
  query ListRooms {
    listRooms {
      id
      name
      createdAt
      owner
    }
  }
`

const CREATE_ROOM = gql`
  mutation createRoom($name: String!) {
    createRoom(name: $name) {
      id
      name
      createdAt
      owner
    }
  }
`
const DELETE_ROOM = gql`
  mutation deleteRoom($roomId: ID!) {
    deleteRoom(roomId: $roomId) {
      id
      name
      createdAt
      owner
    }
  }
`

const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription newMessage($roomId: ID!) {
    newMessage(roomId: $roomId) {
      id
      roomId
      author {
        username
      }
      content
      createdAt
    }
  }
`;

export {
  LIST_USERS,
  LIST_ROOMS,
  NEW_MESSAGE_SUBSCRIPTION,
  CURRENT_USER,
  LOGOUT,
  GET_ROOM,
  CREATE_ROOM,
  DELETE_ROOM
};
