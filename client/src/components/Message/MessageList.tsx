import React from "react";
import styled from "styled-components";
import { Member, Message as IMessage } from "graphql/generated/graphql";

import Message from "components/Message/Message";
import { useAuthContext } from "contexts/AuthContext";

interface IMessageList {
  messages?: IMessage[];
  onScroll?: (event: any) => void;
}

const StyledMessageList = styled.section`
  overflow-y: scroll;
  height: calc(100vh - 150px);
`;

const MessageList = React.forwardRef<
  HTMLElement,
  IMessageList
>(({ messages, onScroll }, ref) => {
  const { user } = useAuthContext();

  return (
    <StyledMessageList
      ref={ref}
      onScrollCapture={onScroll}
      className="message__list"
    >
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
    </StyledMessageList>
  );
});

export default MessageList;
