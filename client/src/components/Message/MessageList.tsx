import React from "react";
import { Member, MessageEdge } from "graphql/generated/graphql";

import MessageContainer from "components/Message/MessageContainer";
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
          <MessageContainer
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
