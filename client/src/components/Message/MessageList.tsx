import React from "react";
import { Member, MessageEdge } from "graphql/generated/graphql";

import Message from "components/Message/Message";
import { useAuthContext } from "contexts/AuthContext";

interface IMessageList {
  messages?: MessageEdge[];
}

const MessageList: React.FC<IMessageList> = ({ messages }) => {
  const { user } = useAuthContext();

  return (
    <>
      {messages?.map(({ node }) => {
        return (
          <Message
            id={node.id}
            key={node.id}
            date={node.createdAt}
            content={node.content}
            author={node.author as Member}
            isAuthor={node.author.id === user.id}
          />
        );
      })}
    </>
  );
};

export default React.memo(MessageList);
