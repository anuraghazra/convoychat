import gql from "graphql-tag";

export default gql`
  query getRoom($roomId: ID!, $limit: Int!, $offset: Int!) {
    room: getRoom(id: $roomId) {
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
    }
    messages: getMessages(roomId: $roomId, limit: $limit, offset: $offset) {
      totalDocs
      totalPages
      messages {
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
  }

  query ListRooms {
    listRooms {
      id
      name
      createdAt
      owner
    }
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
`