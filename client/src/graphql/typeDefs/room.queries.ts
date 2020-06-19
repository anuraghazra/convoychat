import gql from "graphql-tag";

export default gql`
  fragment RoomMember on Member {
    id
    name
    username
    avatarUrl
    createdAt
  }

  query getRoom($roomId: ObjectId!, $limit: Int!, $offset: Int!) {
    room: getRoom(id: $roomId) {
      id
      name
      owner
      createdAt
      members {
        ...RoomMember
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
        mentions
        author {
          id
          name
          username
          avatarUrl
          color
        }
      }
    }
  }

  mutation removeMember($roomId: ObjectId!, $memberId: ObjectId!) {
    removedMember: removeMemberFromRoom(roomId: $roomId, memberId: $memberId) {
      ...RoomMember
    }
  }

  mutation createRoom($name: String!) {
    newRoom: createRoom(name: $name) {
      id
      name
      createdAt
      owner
    }
  }

  mutation deleteRoom($roomId: ObjectId!) {
    deletedRoom: deleteRoom(roomId: $roomId) {
      id
      name
      createdAt
      owner
    }
  }
`