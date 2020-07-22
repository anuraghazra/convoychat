import React from "react";
import ContentLoader from "react-content-loader";
import { Member, MessageEdge } from "graphql/generated/graphql";

import MessageContainer from "components/Message/MessageContainer";
import { useAuthContext } from "contexts/AuthContext";

import theme from "styles/theme";
import { Flex } from "@convoy-ui";

interface IMessageList {
  messages?: Partial<MessageEdge>[];
  isLoading?: boolean;
}

const MessageList: React.FC<IMessageList> = ({ messages, isLoading }) => {
  const { user } = useAuthContext();

  return (
    <>
      {isLoading && <Loader />}
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

const Loader = () => {
  return (
    <Flex direction="column">
      {[1, 2, 3, 4, 5].map(l => {
        return (
          <ContentLoader
            speed={2}
            height={80}
            width="100%"
            backgroundColor={theme.colors.dark1}
            foregroundColor={theme.colors.dark2}
          >
            <rect x="15" y="10" rx="100" ry="100" width="35" height="35" />
            <rect x="60" y="17" rx="4" ry="4" width="100" height="13" />
            <rect x="60" y="40" rx="3" ry="3" width="250" height="10" />
          </ContentLoader>
        );
      })}
    </Flex>
  );
};

export default React.memo(MessageList);
