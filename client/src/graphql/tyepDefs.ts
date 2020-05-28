import gql from 'graphql-tag'

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
        id,
        username,
        rooms {
          id
          name
        }
        createdAt
    }
  }
`

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
`

export { LOGIN, LIST_USERS, NEW_MESSAGE_SUBSCRIPTION }