import React from "react";
import Message from "components/Message";
import { Member } from "graphql/generated/graphql";

interface IMessageList {
  messages?: any[];
}

const MessageList: React.FC<IMessageList> = ({ messages }) => {
  return (
    <div>
      {messages?.map(message => {
        return (
          <Message
            key={message.id}
            author={message.author as Member}
            content={message.content}
          />
        );
      })}
    </div>
  );
};

export default MessageList;
