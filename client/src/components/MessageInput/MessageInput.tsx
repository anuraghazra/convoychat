import React, { useEffect, useRef, useCallback } from "react";
import { FaSmile, FaPaperPlane, FaImage } from "react-icons/fa";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { useDropzone } from "react-dropzone";

import {
  SendButton,
  MessageInputWrapper,
  defaultMentionStyles,
} from "./MessageInput.style";

import {
  RoomMemberFragment,
  useUploadImageMutation,
} from "graphql/generated/graphql";

import { textareaAutoResize } from "utils";
import { Flex, Dropdown, IconButton, toast } from "@convoy-ui";
import { MentionsInput, Mention, OnChangeHandlerFunc } from "react-mentions";

const mql = window.matchMedia(`(min-width: 800px)`);

interface IMessageInput {
  value: string;
  onCancel?: () => void;
  handleChange: OnChangeHandlerFunc;
  onEmojiClick?: (emoji: any) => void;
  mentionSuggestions: RoomMemberFragment[];
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  innerRef?: React.MutableRefObject<HTMLTextAreaElement | undefined>;
  setValue?: (value: React.SetStateAction<string>) => void;
  [x: string]: any;
}
type ISuggestionsData = { display: any; id: string }[] | undefined;

const MessageInput: React.FC<IMessageInput> = ({
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

  // Image uploading
  const [
    uploadImage,
    { loading: uploadImageInProgress },
  ] = useUploadImageMutation({
    onCompleted(data) {
      const replacedPlaceholder = value.replace(
        "![Uplading image...](...please wait)",
        `![Alt Text](${data.uploadImage.url})`
      );
      setValue && setValue(replacedPlaceholder);
    },
    onError(err) {
      toast.error("Something went wrong uploading image.");
    },
  });

  const handleOnDrop = useCallback(
    acceptedFiles => {
      uploadImage({
        variables: {
          file: acceptedFiles[0],
        },
      });
    },
    [uploadImage]
  );

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop: handleOnDrop,
    onDropAccepted: () => {
      setValue && setValue(value + `\n\n![Uplading image...](...please wait)`);
    },
    accept: "image/jpeg, image/png",
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <MessageInputWrapper className="message__input">
      <Flex gap="large" align="center" justify="space-between" nowrap>
        <IconButton
          data-testid="upload-button"
          isLoading={uploadImageInProgress}
          icon={<FaImage />}
          onClick={open}
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
