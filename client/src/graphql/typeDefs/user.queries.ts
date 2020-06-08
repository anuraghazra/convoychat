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

  query listUsers {
    users: listUsers {
      id
      name
      avatarUrl
      username
      rooms
      createdAt
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