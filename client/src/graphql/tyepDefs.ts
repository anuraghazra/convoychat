import { gql } from 'apollo-boost'

const LOGIN = gql`
  query login($username: String!, $password: String!) {
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

export { LOGIN, LIST_USERS }