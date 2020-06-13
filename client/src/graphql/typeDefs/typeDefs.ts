import gql from "graphql-tag";

const typeDefs = gql`
  fragment MessageParts on Message {
    id
    roomId
    content
    createdAt
    mentions
    author {
      id
      username
    }
  }
  
  fragment SubscriptionMessageParts on Message {
    id
    content
    roomId
    createdAt
    mentions
    author {
      id
      name
      username
      avatarUrl
    }
  }

  mutation sendMessage($roomId: ID!, $content: String!, $mentions: [ID!]!) {
    sendMessage(roomId: $roomId, content: $content, mentions: $mentions) {
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
      }
    }
  }
  
  mutation deleteMessage($messageId: ID!) {
    deletedMessage: deleteMessage(messageId: $messageId) {
      ...MessageParts
    }
  }

  mutation editMessage($messageId: ID!, $content: String!) {
    editedMessage: editMessage(messageId: $messageId, content: $content) {
        ...MessageParts
    }
  }

  subscription onNewMessage($roomId: ID!) {
    onNewMessage(roomId: $roomId) {
      ...SubscriptionMessageParts
    }
  }

  subscription onDeleteMessage($roomId: ID!) {
    onDeleteMessage(roomId: $roomId) {
      ...SubscriptionMessageParts
    }
  }
  
  subscription onUpdateMessage($roomId: ID!) {
    onUpdateMessage(roomId: $roomId) {
      ...SubscriptionMessageParts
    }
  }
`

export {
  typeDefs
};
