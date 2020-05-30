import gql from "graphql-tag";

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

export { LIST_USERS, NEW_MESSAGE_SUBSCRIPTION };
