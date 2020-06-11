import React, { useState } from "react";
import MarkdownView from "react-showdown-safe";
import DOMPurify from "dompurify";
import { useForm } from "react-hook-form";
import { FaTrash, FaPen, FaSpinner } from "react-icons/fa";
import {
  Member,
  useEditMessageMutation,
  useDeleteMessageMutation,
} from "graphql/generated/graphql";

import { timeAgo } from "utils";
import { Avatar, Flex } from "@convoy-ui";
import { deleteMessageMutationUpdater } from "./Message.helpers";

import MessageInput from "components/Message/MessageInput";
import StyledMessage from "./Message.style";

interface IInputs {
  message: string;
}
interface IMessage {
  id: string;
  content: string;
  author: Member;
  date: string;
  isAuthor?: boolean;
}

const Message: React.FC<IMessage> = ({
  id,
  content,
  date,
  author,
  isAuthor,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    errors: formErrors,
  } = useForm<IInputs>();

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
  const handleEdit = (data: any) => {
    editMessage({ variables: { messageId: id, content: data.message } });
  };
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <StyledMessage className="message__item">
      <Flex direction="column">
        <Flex gap="medium" align="center" nowrap>
          <Avatar size={35} src={author?.avatarUrl} />
          <p className="textcolor--primary">{author?.name}</p>
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
              autoFocus
              name="message"
              errors={formErrors}
              defaultValue={content}
              onCancel={handleCancel}
              onSubmit={handleSubmit(handleEdit)}
              onEmojiClick={emoji => {
                setValue("message", getValues().message + emoji.native);
              }}
              inputRef={register({ required: "Message is required" })}
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

export default Message;
