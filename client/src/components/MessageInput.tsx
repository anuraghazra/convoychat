import React from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";

import { Flex, Input, Dropdown } from "@convoy-ui";

const MessageInputWrapper = styled.div`
  position: sticky;
  bottom: 0;
  padding: 15px;
  margin-left: -15px;
  margin-right: -15px;
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
`;

interface IMessageInput {
  onSubmit?: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
  errors?: any;
  name?: string;
  [x: string]: any;
}
const MessageInput: React.FC<IMessageInput> = ({
  name,
  onSubmit,
  inputRef,
  errors,
  ...props
}) => {
  const [chosenEmoji, setChosenEmoji] = React.useState(null);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  return (
    <MessageInputWrapper>
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
            <Picker onEmojiClick={onEmojiClick} />
          </Dropdown.Content>
        </Dropdown>
      </Flex>
    </MessageInputWrapper>
  );
};

export default MessageInput;
