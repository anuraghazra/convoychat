import React, { useEffect, useRef, useState } from "react";
import { FaSmile, FaPaperPlane } from "react-icons/fa";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

import { Flex, Dropdown, IconButton } from "@convoy-ui";
import { textareaAutoResize } from "utils";
import { MentionsInput, Mention } from "react-mentions";
import {
  MessageInputWrapper,
  SendButton,
  defaultMentionStyles,
} from "./MessageInput.style";
import { RoomMemberFragment } from "graphql/generated/graphql";

const mql = window.matchMedia(`(min-width: 800px)`);

interface useMessageReturn {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  handleChange: (e: any) => void;
  handleEmojiClick: (emoji: string) => void;
}

export const useMessageInput = ({
  defaultValue,
}: { defaultValue?: string } = {}): useMessageReturn => {
  const [value, setValue] = useState<string>(defaultValue);
  const handleChange = (e: any) => setValue(e.target.value);

  const handleEmojiClick = (emoji: any) => {
    setValue(value + emoji.native);
  };

  return { value, setValue, handleChange, handleEmojiClick };
};

interface IMessageInput {
  value: string;
  onCancel?: () => void;
  onEmojiClick?: (emoji: any) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  mentionSuggestions: RoomMemberFragment[];
  [x: string]: any;
}
const MessageInput: React.FC<IMessageInput> = ({
  value,
  onSubmit,
  onCancel,
  handleChange,
  onEmojiClick,
  mentionSuggestions,
  ...props
}) => {
  const isMobile = !mql.matches;
  const formRef = useRef<HTMLFormElement>();
  const textareaRef = useRef<HTMLTextAreaElement>();
  const suggestionsData = useRef<
    { display: string; id: string }[] | undefined
  >();

  const imparativeSubmit = (event: any) => {
    event.preventDefault();
    formRef?.current.dispatchEvent(new Event("submit", { cancelable: true }));
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    textareaAutoResize(textareaRef?.current);

    if (event.key === "Escape") {
      onCancel && onCancel();
    }
    if (isMobile) return;

    if (event.key === "Enter" && !event.shiftKey) {
      imparativeSubmit(event);
    }
  };

  useEffect(() => {
    textareaAutoResize(textareaRef?.current);
  }, []);

  useEffect(() => {
    suggestionsData.current = mentionSuggestions?.map(curr => {
      return { display: curr.name, id: curr.username };
    });
  }, [mentionSuggestions]);

  const getRef: any = (e: any) => {
    textareaRef.current = e;
  };

  return (
    <MessageInputWrapper className="message__input">
      <Flex gap="large" align="center" justify="space-between" nowrap>
        <form ref={formRef} onSubmit={onSubmit}>
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
              displayTransform={(id: any) => `@${id} `}
            />
          </MentionsInput>
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
