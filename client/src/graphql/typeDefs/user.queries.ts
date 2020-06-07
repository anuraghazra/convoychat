import gql from "graphql-tag";

export default gql`
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

  query ListCurrentUserRooms {
    currentUserRooms: listCurrentUserRooms {
      id
      name
      createdAt
      owner
    }
  }

  mutation logout {
    logout
  }
`