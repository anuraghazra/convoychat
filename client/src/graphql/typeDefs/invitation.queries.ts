import gql from "graphql-tag";

export default gql`
  query getInvitationInfo($token: String!) {
    invitationInfo: getInvitationInfo(token: $token) {
      id
      room {
        name
        id
      }
      invitedBy {
        name
      }
      createdAt
      isPublic
    }
  }

  mutation createInvitationLink($roomId: ID!) {
    invitation: createInvitationLink(roomId: $roomId) {
      link
    }
  }

  mutation acceptInvitation($token: String!) {
    acceptInvitation(token: $token)
  }
`