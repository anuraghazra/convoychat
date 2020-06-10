import React from "react";
import styled from "styled-components";
import { Member, Message as IMessage } from "graphql/generated/graphql";

import Message from "components/Message/Message";
import { useAuthContext } from "contexts/AuthContext";
import { Loading } from "@convoy-ui";

interface IMessageList {
  messages?: IMessage[];
  onScroll?: (event: any) => void;
  isFetchingMore?: boolean;
}

const StyledMessageList = styled.section`
  overflow-y: scroll;

  @media (${p => p.theme.media.tablet}) {
    margin-top: 70px;
  }
`;

const MessageList = React.forwardRef<HTMLElement, IMessageList>(
  ({ messages, onScroll, isFetchingMore }, ref) => {
    const { user } = useAuthContext();

    return (
      <StyledMessageList
        ref={ref}
        onScrollCapture={onScroll}
        className="message__list"
      >
        {isFetchingMore && <Loading />}
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
  }
);

export default MessageList;
