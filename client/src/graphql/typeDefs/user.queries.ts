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
      color
      links {
        github
        twitter
        instagram
        website
      }
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
      color
      rooms
      createdAt
      links {
        github
        twitter
        instagram
        website
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

  mutation setUserColor($color: String!) {
    setColor(color: $color) {
      id
      color
    }
  }

  mutation setUserLinks($github: String, $twitter: String, $instagram: String, $website: String) {
    setUserLinks(github: $github, twitter: $twitter, instagram: $instagram, website: $website) {
      id
      links {
        github
        twitter
        instagram
        website
      }
    }
  }


  mutation setUserSettings(
    $color: String!,
    $github: String,
    $twitter: String,
    $instagram: String,
    $website: String  
  ) {
    setColor(color: $color) {
      id
      color
    }
    setUserLinks(
      github: $github, 
      twitter: $twitter, 
      instagram: $instagram, 
      website: $website
    ) {
      id
      links {
        github
        twitter
        instagram
        website
      }
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