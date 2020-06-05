import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { FaSmile } from "react-icons/fa";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

import { Flex, StyledInput, Dropdown } from "@convoy-ui";
import { textareaAutoResize } from "utils";

const MessageInputWrapper = styled.div`
  position: sticky;
  bottom: 0;
  padding: ${p => p.theme.space.xlarge}px;
  background-color: ${p => p.theme.colors.dark2};

  form {
    width: 100%;
    border-radius: ${p => p.theme.radius.small}px;

    textarea {
      width: 100%;
      height: 100%;
      background-color: ${p => p.theme.colors.dark3};
      padding-left: 20px;
      padding-right: 20px;
      resize: vertical;
    }
  }
  .form--input__wrapper {
    margin-bottom: 0;
  }

  .dropdown--content {
    padding: 0;
  }
`;

interface IMessageInput {
  errors?: any;
  name?: string;
  inputRef?: any;
  onSubmit?: () => void;
  onCancel?: () => void;
  onEmojiClick?: (emoji: any) => void;
  [x: string]: any;
}

const MessageInput: React.FC<IMessageInput> = ({
  name,
  errors,
  inputRef,
  onSubmit,
  onCancel,
  onEmojiClick,
  ...props
}) => {
  const formRef = useRef<HTMLFormElement>();
  const textareaRef = useRef<HTMLTextAreaElement>();

  const handleKeydown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    textareaAutoResize(textareaRef?.current);

    if (event.key === "Escape") {
      onCancel && onCancel();
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      formRef?.current.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  };

  useEffect(() => {
    textareaAutoResize(textareaRef?.current);
  }, []);

  return (
    <MessageInputWrapper className="message__input">
      <Flex gap="large" align="center" justify="space-between" nowrap>
        <form ref={formRef} onSubmit={onSubmit}>
          <StyledInput
            as="textarea"
            name={name}
            ref={(e: HTMLTextAreaElement) => {
              textareaRef.current = e;
              inputRef(e);
            }}
            autoComplete={"off"}
            placeholder="Write something"
            onKeyDown={handleKeydown}
            {...props}
          />
        </form>
        <Dropdown>
          <Dropdown.Toggle>
            <FaSmile />
          </Dropdown.Toggle>
          <Dropdown.Content style={{ position: "absolute", bottom: 0 }}>
            <Picker
              set="apple"
              theme="dark"
              onSelect={(emoji: any) => onEmojiClick && onEmojiClick(emoji)}
            />
          </Dropdown.Content>
        </Dropdown>
      </Flex>
    </MessageInputWrapper>
  );
};

export default MessageInput;
