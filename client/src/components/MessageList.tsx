import React from "react";
import Message from "components/Message/Message";
import { Member, Message as IMessage } from "graphql/generated/graphql";
import { useAuthContext } from "contexts/AuthContext";

interface IMessageList {
  messages?: IMessage[];
}

const MessageList: React.FC<IMessageList> = ({ messages }) => {
  const { user } = useAuthContext();

  return (
    <div>
      {messages?.map(message => {
        return (
          <Message
            id={message.id}
            key={message.id}
            date={message.createdAt}
            content={message.content}
            author={message.author as Member}
            isAuthor={message.author.id === user.id}
          />
        );
      })}
    </div>
  );
};

export default MessageList;
