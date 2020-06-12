import styled from "styled-components";
import { Button, InputStyles } from "@convoy-ui";
import theme from "styles/theme";

export const SendButton = styled(Button)`
  width: 40px;
  min-width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50px;
`;

export const MessageInputWrapper = styled.div`
  position: relative;
  bottom: 0;
  padding: ${p => p.theme.space.xlarge}px;
  background-color: ${p => p.theme.colors.dark2};

  form {
    width: 100%;
    border-radius: ${p => p.theme.radius.small}px;
  }

  .form--input__wrapper {
    margin-bottom: 0;
  }
  .input__send-button {
    margin: 0;
  }

  .dropdown--content {
    padding: 0;
  }
`;

const common = {
  width: "100%",
  maxHeight: "100px",
  backgroundColor: theme.colors.dark3,
  paddingLeft: "20px",
  paddingRight: "20px",
  resize: "none",
  color: "inherit",
  borderRadius: theme.radius.small,
};
export const defaultMentionStyles = {
  control: {
    fontSize: 14,
    fontWeight: "normal",
    margin: 0,
    ...common,
  },

  input: {
    margin: 0,
    padding: 10,
    border: "none",
    ...common,
  },

  highlighter: {
    overflow: "hidden",
  },

  suggestions: {
    borderRadius: theme.radius.small,
    overflow: "hidden",
    list: {
      backgroundColor: theme.colors.dark2,
      color: theme.colors.white,
      fontSize: 14,
    },
    item: {
      padding: "10px 15px",
      borderRadius: theme.radius.small,
      "&focused": {
        backgroundColor: theme.colors.dark1,
      },
    },
  },
};
