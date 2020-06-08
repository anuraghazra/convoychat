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

  mutation inviteMembers($roomId: ID!, $members: [ID!]!) {
    invitations: inviteMembers(roomId: $roomId, members: $members) {
      id
      roomId
      isPublic
      userId
      invitedBy
      createdAt
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