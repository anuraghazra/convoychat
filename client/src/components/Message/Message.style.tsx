import styled from "styled-components";

const StyledMessage = styled.section`
  font-size: 14px;
  padding: ${p => p.theme.space.xlarge}px;
  word-break: break-word;

  p {
    margin: 0;
  }
  .message__content {
    margin: 0;
    margin-left: 45px;
    font-size: 14px;
    line-height: 1.4em;
  }

  .message__date {
    font-size: 12px;
    color: ${p => p.theme.colors.gray};
  }

  &:hover {
    background-color: ${p => p.theme.colors.dark2};
  }

  .message__input {
    padding: 0;
    margin-top: 10px;
    background-color: initial;
  }

  .message__actions {
    opacity: 0;
    font-size: 14px;
    margin-left: auto;
    color: ${p => p.theme.colors.gray};
    z-index: 1; /* firefox fix */
    svg {
      cursor: pointer;
    }
  }
  &:hover .message__actions {
    opacity: 1;
  }

  .markdown-content {
    a {
      color: #758af6;
      &:hover {
        color: ${p => p.theme.colors.primary};
      }
    }
  }
`;

export default StyledMessage;
