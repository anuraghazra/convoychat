import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaSmile, FaPaperPlane } from "react-icons/fa";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

import {
  SendButton,
  MessageInputWrapper,
  defaultMentionStyles,
} from "./MessageInput.style";

import { textareaAutoResize } from "utils";
import { Flex, Dropdown, IconButton } from "@convoy-ui";
import { RoomMemberFragment } from "graphql/generated/graphql";
import { MentionsInput, Mention, OnChangeHandlerFunc } from "react-mentions";

const mql = window.matchMedia(`(min-width: 800px)`);

interface useMessageReturn {
  value: string;
  handleChange: OnChangeHandlerFunc;
  handleEmojiClick: (emoji: string) => void;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  textareaRef: React.RefObject<HTMLTextAreaElement | undefined>;
}

interface IMessageInput {
  value: string;
  onCancel?: () => void;
  handleChange: OnChangeHandlerFunc;
  onEmojiClick?: (emoji: any) => void;
  mentionSuggestions: RoomMemberFragment[];
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  innerRef?: React.MutableRefObject<HTMLTextAreaElement | undefined>;
  [x: string]: any;
}

const MessageInput: React.FC<IMessageInput> = ({
  value,
  innerRef,
  onCancel,
  handleSubmit,
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
    innerRef.current = e;
  };

  return (
    <MessageInputWrapper className="message__input">
      <Flex gap="large" align="center" justify="space-between" nowrap>
        <form ref={formRef} onSubmit={handleSubmit}>
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

export const useMessageInput = ({
  defaultValue,
}: { defaultValue?: string } = {}): useMessageReturn => {
  const textareaRef = useRef<HTMLTextAreaElement | undefined>();
  const [value, setValue] = useState<string>(defaultValue || "");
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value),
    []
  );

  const handleEmojiClick = useCallback((emoji: any) => {
    setValue(prev => {
      const el = textareaRef.current;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const before = prev.substring(0, start);
      const after = prev.substring(end, prev.length);
      el.selectionStart = 5;
      el.focus();
      return before + emoji.native + after;
    });
  }, []);

  return { value, setValue, handleChange, handleEmojiClick, textareaRef };
};

export default MessageInput;
