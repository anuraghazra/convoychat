import React from "react";
import { FaSpinner } from "react-icons/fa";
import { Flex, Avatar } from "@convoy-ui";
import StyledMessage from "./Message.style";
import { Member } from "graphql/generated/graphql";
import { timeAgo } from "utils";

type IMessageActions = React.FC<{ isAuthor?: boolean }>;
const MessageActions: IMessageActions = ({ isAuthor, children }) => {
  return (
    <Flex className="message__actions" gap="medium" align="center" nowrap>
      {isAuthor ? children : null}
    </Flex>
  );
};

type IMessageAction = React.FC<{ loading?: boolean }>;
const MessageAction: IMessageAction = ({ loading, children }) => {
  return <>{loading ? <FaSpinner className="spin" /> : children}</>;
};

type IMessageContent = React.FC<{
  isEditing?: boolean;
  onEditing?: React.ReactNode;
}>;
const MessageContent: IMessageContent = ({
  isEditing,
  onEditing,
  children,
}) => {
  return (
    <div className="message__content">
      {isEditing ? (
        onEditing
      ) : (
        <div className="markdown-content">{children}</div>
      )}
    </div>
  );
};

type IMessageMetaInfo = React.FC<{
  author: Partial<Pick<Member, "avatarUrl" | "color" | "name">>;
  date?: string;
}>;
const MessageMetaInfo: IMessageMetaInfo = ({ author, date, children }) => {
  return (
    <Flex gap="medium" align="center" nowrap>
      <Avatar size={35} src={author?.avatarUrl} />
      <p className="textcolor--primary" style={{ color: author?.color }}>
        {author?.name}
      </p>
      <span className="message__date">messaged {timeAgo(date)}</span>
      {children}
    </Flex>
  );
};
MessageMetaInfo.defaultProps = {
  date: new Date().toString(),
};

type StaticComponents = {
  Actions: IMessageActions;
  Action: IMessageAction;
  Content: IMessageContent;
  MetaInfo: IMessageMetaInfo;
};

const Message: React.FC & StaticComponents = ({ children }) => {
  return (
    <StyledMessage className="message__item">
      <Flex direction="column">{children}</Flex>
    </StyledMessage>
  );
};

Message.Actions = MessageActions;
Message.Action = MessageAction;
Message.MetaInfo = MessageMetaInfo;
Message.Content = MessageContent;

export default Message;
