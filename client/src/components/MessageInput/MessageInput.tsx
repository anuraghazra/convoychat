import React, { useEffect, useRef } from "react";
import { FaSmile, FaPaperPlane, FaImage } from "react-icons/fa";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

import {
  SendButton,
  MessageInputWrapper,
  defaultMentionStyles,
} from "./MessageInput.style";

import { Member as IMember } from "graphql/generated/graphql";

import useImageUpload from "./useImageUpload";
import { textareaAutoResize } from "utils";
import { Flex, Dropdown, IconButton } from "@convoy-ui";
import { MentionsInput, Mention, OnChangeHandlerFunc } from "react-mentions";

const mql = window.matchMedia(`(min-width: 800px)`);

interface IMessageInput {
  value: string;
  onCancel?: () => void;
  handleChange: OnChangeHandlerFunc;
  onEmojiClick?: (emoji: any) => void;
  mentionSuggestions: Partial<IMember>[];
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  innerRef?: React.MutableRefObject<HTMLTextAreaElement | undefined>;
  setValue?: (value: React.SetStateAction<string>) => void;
}
type ISuggestionsData = { display: any; id: string }[] | undefined;
// prettier-ignore
type MessageInputType = React.FC<IMessageInput> & React.HTMLAttributes<HTMLTextAreaElement>;

const MessageInput: MessageInputType = ({
  value,
  innerRef,
  onCancel,
  handleSubmit,
  handleChange,
  onEmojiClick,
  mentionSuggestions,
  setValue,
  ...props
}) => {
  const isMobile = !mql.matches;
  const formRef = useRef<HTMLFormElement>();
  const textareaRef = useRef<HTMLTextAreaElement>();
  const suggestionsData = useRef<ISuggestionsData>();

  const {
    open,
    getRootProps,
    isDragActive,
    getInputProps,
    uploadImageInProgress,
  } = useImageUpload({
    value,
    setValue,
  });

  const imparativeSubmit = (event: any) => {
    event.preventDefault();
    formRef?.current.dispatchEvent(new Event("submit", { cancelable: true }));
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      onCancel && onCancel();
    }
    if (isMobile) return;
    if (event.key === "Enter" && !event.shiftKey) {
      imparativeSubmit(event);
    }
  };

  const getRef: any = (e: any) => {
    textareaRef.current = e;
    if (innerRef) {
      innerRef.current = e;
    }
  };

  useEffect(() => {
    textareaAutoResize(textareaRef?.current);
  }, [value]);

  useEffect(() => {
    suggestionsData.current = mentionSuggestions?.map(curr => {
      return {
        display: curr.username,
        id: curr.id,
      };
    });
  }, [mentionSuggestions]);

  return (
    <MessageInputWrapper className="message__input">
      <Flex gap="large" align="center" justify="space-between" nowrap>
        <IconButton
          onClick={open}
          icon={<FaImage />}
          data-testid="upload-button"
          isLoading={uploadImageInProgress}
        />

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={isDragActive ? "active-animation" : ""}
        >
          <div {...getRootProps({ className: "dropzone" })}>
            <MentionsInput
              data-testid="messageInput"
              name={"message"}
              inputRef={getRef}
              autoComplete={"off"}
              placeholder="Write something"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeydown}
              style={defaultMentionStyles}
              allowSuggestionsAboveCursor={true}
              {...props}
            >
              <Mention
                trigger="@"
                data={suggestionsData?.current || []}
                displayTransform={id =>
                  `@${suggestionsData.current.find(i => i.id === id).display} `
                }
              />
            </MentionsInput>
            <input {...getInputProps()} data-testid="dropzone" />
          </div>
        </form>
        {isMobile && (
          <SendButton
            icon={FaPaperPlane}
            onClick={imparativeSubmit}
            className="input__send-button"
          />
        )}
        {!isMobile && (
          <Dropdown>
            <Dropdown.Toggle>
              <IconButton icon={<FaSmile />} />
            </Dropdown.Toggle>
            <Dropdown.Content style={{ position: "absolute", bottom: 0 }}>
              <Picker
                set="apple"
                theme="dark"
                onSelect={(emoji: any) => onEmojiClick && onEmojiClick(emoji)}
              />
            </Dropdown.Content>
          </Dropdown>
        )}
      </Flex>
    </MessageInputWrapper>
  );
};

export default MessageInput;
