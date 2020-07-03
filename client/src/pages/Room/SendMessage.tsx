import React, { useCallback } from "react";

import {
  sendMessageOptimisticResponse,
  updateCacheAfterSendMessage,
} from "./Room.helpers";
import {
  Member as IMember,
  useSendMessageMutation,
} from "graphql/generated/graphql";

import { scrollToBottom } from "utils";
import { useAuthContext } from "contexts/AuthContext";
import MessageInput from "components/MessageInput/MessageInput";
import useMessageInput from "components/MessageInput/useMessageInput";

interface ISendMessage {
  roomId: string;
  bodyRef: React.MutableRefObject<HTMLElement>;
  members?: Partial<IMember>[];
}
const SendMessage: React.FC<ISendMessage> = ({ roomId, bodyRef, members }) => {
  const { user } = useAuthContext();

  const {
    value,
    setValue,
    textareaRef,
    handleChange,
    handleEmojiClick,
  } = useMessageInput();

  // send message mutation
  const [sendMessage, { error: sendError }] = useSendMessageMutation({
    optimisticResponse: sendMessageOptimisticResponse(roomId, value, user),
    onError(err) {
      console.log(err);
    },
    update: updateCacheAfterSendMessage,
  });

  // submit message
  const onMessageSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      sendMessage({
        variables: {
          content: (event.target as any).message.value,
          roomId: roomId,
        },
      });
      setValue("");
      window.setTimeout(() => {
        scrollToBottom(bodyRef?.current);
      }, 50);
    },
    []
  );

  return (
    <React.Fragment>
      {sendError && <span>{sendError?.message}</span>}

      <MessageInput
        value={value}
        setValue={setValue}
        innerRef={textareaRef}
        handleSubmit={onMessageSubmit}
        handleChange={handleChange}
        onEmojiClick={handleEmojiClick}
        mentionSuggestions={members}
      />
    </React.Fragment>
  );
};

export default SendMessage;
