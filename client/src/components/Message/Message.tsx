import React, { useState, useRef, useEffect } from "react";
import DOMPurify from "dompurify";
import MarkdownView from "react-showdown";
import { useParams } from "react-router-dom";
import { useApolloClient } from "@apollo/react-hooks";

import { FaTrash, FaPen, FaSpinner } from "react-icons/fa";
import {
  Member,
  GetRoomQuery,
  GetRoomDocument,
  useEditMessageMutation,
  useDeleteMessageMutation,
} from "graphql/generated/graphql";

import { timeAgo } from "utils";
import { Avatar, Flex } from "@convoy-ui";
import { deleteMessageMutationUpdater } from "./Message.helpers";

import StyledMessage from "./Message.style";
import { MAX_MESSAGES } from "../../constants";
import MessageInput from "components/MessageInput/MessageInput";
import useMessageInput from "components/MessageInput/useMessageInput";

interface IMessage {
  id: string;
  content: string;
  author: Partial<Pick<Member, "avatarUrl" | "color" | "name">>;
  date?: string;
  isAuthor?: boolean;
}

const Message: React.FC<IMessage> = ({
  id,
  content,
  date,
  author,
  isAuthor,
}) => {
  const client = useApolloClient();
  const roomData = useRef<GetRoomQuery>();
  const { roomId } = useParams();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const {
    value,
    textareaRef,
    handleChange,
    handleEmojiClick,
  } = useMessageInput({
    defaultValue: content,
  });

  let [
    deleteMessage,
    { loading: isDeleting, error },
  ] = useDeleteMessageMutation({
    update: deleteMessageMutationUpdater,
  });

  let [
    editMessage,
    { loading: editLoading, error: editError },
  ] = useEditMessageMutation({
    onCompleted() {
      setIsEditing(false);
    },
  });

  const handleDelete = () => {
    deleteMessage({ variables: { messageId: id } });
  };
  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    editMessage({
      variables: {
        messageId: id,
        content: (event.target as any).message.value,
      },
    });
  };
  const handleCancel = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    try {
      roomData.current = client.readQuery<GetRoomQuery>({
        query: GetRoomDocument,
        variables: { roomId: roomId, limit: MAX_MESSAGES, offset: 0 },
      });
    } catch (err) {
      console.log(err);
    }
  }, [roomId]);

  return (
    <StyledMessage className="message__item">
      <Flex direction="column">
        <Flex gap="medium" align="center" nowrap>
          <Avatar size={35} src={author?.avatarUrl} />
          <p className="textcolor--primary" style={{ color: author?.color }}>
            {author?.name}
          </p>
          <span className="message__date">messaged {timeAgo(date)}</span>
          {isAuthor && (
            <Flex
              className="message__actions"
              gap="medium"
              align="center"
              nowrap
            >
              {editLoading ? (
                <FaSpinner className="spin" />
              ) : (
                <FaPen onClick={() => setIsEditing(true)} />
              )}
              {isDeleting ? (
                <FaSpinner className="spin" />
              ) : (
                <FaTrash onClick={handleDelete} />
              )}
            </Flex>
          )}
        </Flex>
        <div className="message__content">
          {isEditing ? (
            <MessageInput
              value={value}
              innerRef={textareaRef}
              onCancel={handleCancel}
              handleSubmit={handleEdit}
              handleChange={handleChange}
              onEmojiClick={handleEmojiClick}
              mentionSuggestions={roomData.current?.room?.members}
            />
          ) : (
            <div className="markdown-content">
              <MarkdownView
                markdown={content}
                sanitizeHtml={html => DOMPurify.sanitize(html)}
                options={{
                  tables: false,
                  emoji: true,
                  tasklists: true,
                  encodeEmails: true,
                  ghMentions: true,
                  ghMentionsLink: "/user/{u}",
                  simplifiedAutoLink: true,
                  ghCodeBlocks: true,
                  backslashEscapesHTMLTags: true,
                }}
              />
            </div>
          )}
        </div>
      </Flex>
    </StyledMessage>
  );
};

Message.defaultProps = {
  date: new Date().toString(),
};

export default Message;
