import update from "immutability-helper";
import { scrollToBottom } from "utils";

import {
  Me,
  Message as IMessage,
  OnUpdateMessageDocument,
  OnDeleteMessageDocument,
  OnNewMessageDocument,
  GetRoomQuery,
} from "graphql/generated/graphql";

const subscribeToMessages = (
  subscribeToMore: any,
  variables: any,
  user: Me,
  bodyRef: any
) => {
  // new message subscription
  subscribeToMore({
    variables: variables,
    document: OnNewMessageDocument,
    updateQuery: (prev: GetRoomQuery, data: any) => {
      const newData = data.subscriptionData;
      const newMessage: IMessage = newData.data.onNewMessage;
      if (!newMessage || newMessage.author.id === user.id) return prev;

      window.setTimeout(() => {
        scrollToBottom(bodyRef?.current);
      }, 50);

      return update(prev, {
        messages: { messages: { $push: [newMessage] } },
      });
    },
  });

  // deleteMessage subscription
  subscribeToMore({
    variables: variables,
    document: OnDeleteMessageDocument,
    updateQuery: (prev: GetRoomQuery, data: any) => {
      const newData = data.subscriptionData;
      const deletedMessage: IMessage = newData.data.onDeleteMessage;
      if (!deletedMessage || deletedMessage.author.id === user.id) {
        return prev;
      }

      return update(prev, {
        messages: {
          messages: m => m.filter(m => m.id !== deletedMessage.id),
        },
      });
    },
  });

  // update message subscription
  subscribeToMore({
    variables: variables,
    document: OnUpdateMessageDocument,
  });
};

export default subscribeToMessages;
