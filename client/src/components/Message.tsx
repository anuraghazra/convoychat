import React from "react";
import styled from "styled-components";

import { Flex } from "@convoy-ui";
import { Member } from "graphql/generated/graphql";

const StyledMessage = styled.section`
  font-size: 14px;
  padding: 10px;
  margin-bottom: ${p => p.theme.space.small}px;
`;

interface IMessage {
  content?: string;
  author?: Member;
}

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50px;
  margin-right: ${p => p.theme.space.medium}px;
`;

const Message: React.FC<IMessage> = ({ content, author }) => {
  console.log(author);
  return (
    <StyledMessage>
      <Flex gap="medium" align="center">
        <Avatar src={author?.avatarUrl} />
        <Flex direction="column">
          <span className="textcolor--primary">{author?.name}</span>
          <span>{content}</span>
        </Flex>
      </Flex>
    </StyledMessage>
  );
};

export default Message;
