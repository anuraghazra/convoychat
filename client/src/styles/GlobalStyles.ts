import { createGlobalStyle, css } from "styled-components";
import ReactModalStyles from "./ReactModalStyles";
import EmojiMartStyles from "./EmojiMartStyles";

const ScrollBarStyles = css`
  * {
    scrollbar-width: thin;
    scrollbar-color: ${p => p.theme.colors.dark3} ${p => p.theme.colors.dark1};
  }

  /* Works on Chrome/Edge/Safari */
  *::-webkit-scrollbar {
    width: 12px;
  }
  *::-webkit-scrollbar-track, *::-webkit-scrollbar-corner {
    background: ${p => p.theme.colors.dark1};
  }
  *::-webkit-scrollbar-thumb {
    background-color: ${p => p.theme.colors.dark3};
    border-radius: 20px;
    border: 2px solid ${p => p.theme.colors.dark1};
  }
`;


const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  *:after, *:before {
    box-sizing: border-box;
  }

  ${ScrollBarStyles}
  
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

  ${ReactModalStyles}
  ${EmojiMartStyles}
`;

export default GlobalStyles;
