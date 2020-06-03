import gql from "graphql-tag";

const typeDefs = gql`
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

  query getRoom($roomId: ID!) {
    getRoom(id: $roomId) {
      id
      name
      owner
      createdAt
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
        createdAt
        author {
          id
          name
          username
          avatarUrl
          createdAt
        }
      }
    }
  }

  query ListUsers {
    listUsers {
      username
      id
      rooms {
        id
      }
    }
  }

  query ListRooms {
    listRooms {
      id
      name
      createdAt
      owner
    }
  }

  query ListCurrentUserRooms {
    listCurrentUserRooms {
      id
      name
      createdAt
      owner
    }
  }


  fragment MessageParts on Message {
    id
    roomId
    content
    createdAt
    author {
      id
      username
    }
  }

  mutation logout {
    logout
  }

  mutation createRoom($name: String!) {
    createRoom(name: $name) {
      id
      name
      createdAt
      owner
    }
  }

  mutation deleteRoom($roomId: ID!) {
    deleteRoom(roomId: $roomId) {
      id
      name
      createdAt
      owner
    }
  }

  mutation sendMessage($roomId: ID!, $content: String!) {
    sendMessage(roomId: $roomId, content: $content) {
      id
      roomId
      content
      createdAt
      author {
        id
        name
        username
        avatarUrl
      }
    }
  }
  
  mutation deleteMessage($messageId: ID!) {
    deleteMessage(messageId: $messageId) {
      ...MessageParts
    }
  }

  mutation editMessage($messageId: ID!, $content: String!) {
    editMessage(messageId: $messageId, content: $content) {
        ...MessageParts
    }
  }

  subscription newMessage($roomId: ID!) {
    newMessage(roomId: $roomId) {
      id
      content
      roomId
      createdAt
      author {
        id
        name
        username
        avatarUrl
        createdAt
      }
    }
  }
`

export {
  typeDefs
};
