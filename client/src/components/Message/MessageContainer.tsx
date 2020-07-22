import React, { useState, useRef, useEffect } from "react";
import DOMPurify from "dompurify";
import MarkdownView from "react-showdown";
import { useParams } from "react-router-dom";
import { useApolloClient } from "@apollo/react-hooks";

import { FaTrash, FaPen } from "react-icons/fa";
import {
  Member,
  GetRoomQuery,
  GetRoomDocument,
  useEditMessageMutation,
  useDeleteMessageMutation,
} from "graphql/generated/graphql";

import { deleteMessageMutationUpdater } from "./Message.helpers";

import { MAX_MESSAGES } from "../../constants";
import MessageInput from "components/MessageInput/MessageInput";
import useMessageInput from "components/MessageInput/useMessageInput";
import Message from "./Message";

const markdownSettings = {
  tables: false,
  emoji: true,
  tasklists: true,
  encodeEmails: true,
  ghMentions: true,
  ghMentionsLink: "/user/{u}",
  simplifiedAutoLink: true,
  ghCodeBlocks: true,
  backslashEscapesHTMLTags: true,
};

interface IMessage {
  id: string;
  content: string;
  author: Partial<Pick<Member, "avatarUrl" | "color" | "name">>;
  date?: string;
  isAuthor?: boolean;
}

const MessageContainer: React.FC<IMessage> = ({
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
    setValue,
    textareaRef,
    handleChange,
    handleEmojiClick,
  } = useMessageInput({
    defaultValue: content,
  });

  const [
    deleteMessage,
    { loading: isDeleting, error },
  ] = useDeleteMessageMutation({
    update: deleteMessageMutationUpdater,
  });

  const [
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
        variables: { roomId: roomId, limit: MAX_MESSAGES },
      });
    } catch (err) {
      console.log(err);
    }
  }, [roomId]);

  return (
    <Message>
      <Message.MetaInfo author={author} date={date}>
        <Message.Actions isAuthor={isAuthor}>
          <Message.Action loading={editLoading}>
            <FaPen onClick={() => setIsEditing(true)} />
          </Message.Action>
          <Message.Action loading={isDeleting}>
            <FaTrash onClick={handleDelete} />
          </Message.Action>
        </Message.Actions>
      </Message.MetaInfo>
      <Message.Content
        isEditing={isEditing}
        onEditing={
          <MessageInput
            value={value}
            setValue={setValue}
            innerRef={textareaRef}
            onCancel={handleCancel}
            handleSubmit={handleEdit}
            handleChange={handleChange}
            onEmojiClick={handleEmojiClick}
            mentionSuggestions={roomData.current?.room?.members}
          />
        }
      >
        <MarkdownView
          markdown={content}
          sanitizeHtml={html => DOMPurify.sanitize(html)}
          options={markdownSettings}
        />
      </Message.Content>
    </Message>
  );
};

MessageContainer.defaultProps = {
  date: new Date().toString(),
};

export default React.memo(MessageContainer);
