import gql from "graphql-tag";

export default gql`
  fragment NotificationData on Notification {
    id
    receiver
    seen
    type
    payload
    createdAt
    sender {
      avatarUrl
      name
    }
  }

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

  query getNotifications {
    notifications: getNotifications {
      ...NotificationData
    }
  }

  mutation readNotification($id: ObjectId!) {
    readNotification(id: $id) {
      ...NotificationData
    }
  }

  subscription onNewNotification {
    onNewNotification {
      ...NotificationData
    }
  }

  mutation logout {
    logout
  }
`