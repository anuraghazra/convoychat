import React from "react";
import styled from "styled-components";

import { Avatar, Flex } from "@convoy-ui";
import { Member } from "graphql/generated/graphql";

const StyledMessage = styled.section`
  padding: 0;
  font-size: 14px;
  margin-top: ${p => p.theme.space.xlarge}px;

  p {
    margin: 0;
  }
  .message__content {
    font-size: 14px;
    margin: 0;
    margin-left: 45px;
  }
`;

interface IMessage {
  content?: string;
  author?: Member;
}

const Message: React.FC<IMessage> = ({ content, author }) => {
  return (
    <StyledMessage>
      <Flex direction="column">
        <Flex gap="medium" align="center" nowrap>
          <Avatar size={35} src={author?.avatarUrl} />
          <p className="textcolor--primary">{author?.name}</p>
        </Flex>
        <p className="message__content">{content}</p>
      </Flex>
    </StyledMessage>
  );
};

export default Message;
