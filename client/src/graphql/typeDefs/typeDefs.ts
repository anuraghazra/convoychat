import gql from "graphql-tag";

const typeDefs = gql`
  fragment MessageParts on Message {
    id
    roomId
    content
    createdAt
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
    author {
      id
      name
      username
      avatarUrl
    }
  }

  mutation sendMessage($roomId: ID!, $content: String!) {
    sendMessage(roomId: $roomId, content: $content) {
      id
      roomId
      content
      createdAt
      author {
        id
        name
        username
        avatarUrl
      }
    }
  }
  
  mutation deleteMessage($messageId: ID!) {
    deleteMessage(messageId: $messageId) {
      ...MessageParts
    }
  }

  mutation editMessage($messageId: ID!, $content: String!) {
    editMessage(messageId: $messageId, content: $content) {
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
