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
      color
    }
  }

  mutation sendMessage($roomId: ObjectId!, $content: String!) {
    sendMessage(roomId: $roomId, content: $content) {
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
        color
      }
    }
  }
  
  mutation deleteMessage($messageId: ObjectId!) {
    deletedMessage: deleteMessage(messageId: $messageId) {
      ...MessageParts
    }
  }

  mutation editMessage($messageId: ObjectId!, $content: String!) {
    editedMessage: editMessage(messageId: $messageId, content: $content) {
        ...MessageParts
    }
  }

  subscription onNewMessage($roomId: ObjectId!) {
    onNewMessage(roomId: $roomId) {
      ...SubscriptionMessageParts
    }
  }

  subscription onDeleteMessage($roomId: ObjectId!) {
    onDeleteMessage(roomId: $roomId) {
      ...SubscriptionMessageParts
    }
  }
  
  subscription onUpdateMessage($roomId: ObjectId!) {
    onUpdateMessage(roomId: $roomId) {
      ...SubscriptionMessageParts
    }
  }
`

export {
  typeDefs
};
