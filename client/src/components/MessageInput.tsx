import React from "react";
import styled from "styled-components";
import { FaSmile } from "react-icons/fa";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

import { Flex, Input, Dropdown } from "@convoy-ui";

const MessageInputWrapper = styled.div`
  position: sticky;
  bottom: 0;
  padding: ${p => p.theme.space.xlarge}px;
  background-color: ${p => p.theme.colors.dark2};

  form {
    width: 100%;
    border-radius: ${p => p.theme.radius.small}px;

    input {
      width: 100%;
      background-color: ${p => p.theme.colors.dark3};
      padding-left: 20px;
      padding-right: 20px;
    }
  }
  .form--input__wrapper {
    height: 40px;
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
  onEmojiClick?: (emoji: any) => void;
  [x: string]: any;
}

const MessageInput: React.FC<IMessageInput> = ({
  name,
  errors,
  inputRef,
  onSubmit,
  onEmojiClick,
  ...props
}) => {
  return (
    <MessageInputWrapper className="message__input">
      <Flex gap="large" align="center" justify="space-between" nowrap>
        <form onSubmit={onSubmit}>
          <Input
            type="text"
            name={name}
            errors={errors}
            inputRef={inputRef}
            autoComplete={"off"}
            placeholder="Write something"
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
