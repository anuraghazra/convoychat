import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  html, body {
    font-size: calc(12px + 0.4vw);
    font-family: ${p => p.theme.font.primary};
    font-display: fallback !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 0;
    margin: 0;
  }

  body {
    font-family: inherit;
    height: 100vh;
    color: ${p => p.theme.colors.white};
    background: ${p => p.theme.colors.dark3};
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    line-height: 1.5em;
    letter-spacing: 0px;
    font-family: inherit;
    font-weight: 400;
  }
  p, a {
    font-size: 16px;
  }

  a {
    text-decoration: none;
    line-height: 1.5em;
    color: ${p => p.theme.colors.white};
  }

  .textcolor--primary {
    color: ${p => p.theme.colors.primary};
  }
  .textcolor--gray {
    color: ${p => p.theme.colors.gray};
  }

  .spin {
    animation: spin 1s infinite linear;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .ModalContent {
    top: 40%;
    left: 50%;
    right: auto;
    bottom: auto;
    margin-right: -50%;
    transform: translate(-50%, -50%);

    width: 500px;
    position: absolute;
    border-radius: 5px;
    padding: 30px 30px;
    border-radius: ${p => p.theme.radius.small}px;
    background-color: ${p => p.theme.colors.dark1};
    &:focus {
      outline: none;
    }
  }

  .ModalOverlay  {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(9, 12, 27, 0.5);
  }

  .ReactModal__Body--open #root {
    filter: blur(3px);
  }
  .ReactModal__Overlay {
    opacity: 0;
    transform: scale(1.1);
    transform-origin: center;
    transition: .3s;
  }
  .ReactModal__Overlay--after-open {
    opacity: 1;
    transform: scale(1);
  }
  .ReactModal__Overlay--before-close {
    opacity: 0;
    transform: scale(1.1);
  }
`;

export default GlobalStyles;
