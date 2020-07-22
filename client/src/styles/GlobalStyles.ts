import { createGlobalStyle, css } from "styled-components";
import ReactModalStyles from "./ReactModalStyles";
import EmojiMartStyles from "./EmojiMartStyles";

const ScrollBarStyles = css`
  :root {
    --app-height: 100%;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: ${p => p.theme.colors.dark3} ${p => p.theme.colors.dark1};
  }

  /* Works on Chrome/Edge/Safari */
  *::-webkit-scrollbar {
    width: 12px;
  }
  *::-webkit-scrollbar-track,
  *::-webkit-scrollbar-corner {
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
    @media not all and (hover:hover) {
      height: var(--app-height);
    }
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

  .react-contextmenu {
    padding: 10px;
    border-radius: ${p => p.theme.radius.small}px;
    background-color: ${p => p.theme.colors.dark1};
    
    .react-contextmenu-item {
      border-radius: ${p => p.theme.radius.small}px;
      padding: 0;

      button {
        margin: 0;
      }
    }

    .react-contextmenu-item--divider {
      padding: 1px;
      border-radius: 0;
      margin: 10px;
    }
  }

  .toast-notification {
    & > span {
      z-index: 1000;
      border-radius: ${p => p.theme.radius.small}px !important;
    }
  }

  .bodyOverlayBlur #root {
    filter: blur(3px);
  }
  /* Notification Component Styles */
  /* Had to put it on global styles because i used react portal */
  .notification___dropdown {
    .notification__header {
      position: sticky;
      top: 0;
      height: 60px;
      margin-left: -30px;
      margin-right: -30px;
      padding: 20px;
      background-color: ${p => p.theme.colors.dark1};
    }
    
    padding-top: 0 !important;
    width: 350px;
    height: 400px;
    max-height: 400px;
    overflow-x: hidden !important;
    overflow-y: scroll !important;
    padding: 20px 30px;

    @media (${p => p.theme.media.tablet}) {
      width: 100%;
    }
  }

  /* border animation */
  .active-animation {
    width: 100%;
    height: 100%;
    padding: 2px;
    ${({ theme }) => css`
      background: linear-gradient(
          90deg,
          ${theme.colors.primary} 50%,
          transparent 50%
        ),
        linear-gradient(90deg, ${theme.colors.primary} 50%, transparent 50%),
        linear-gradient(0deg, ${theme.colors.primary} 50%, transparent 50%),
        linear-gradient(0deg, ${theme.colors.primary} 50%, transparent 50%);
    `}
    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
    background-size: 15px 2px, 15px 2px, 2px 15px, 2px 15px;
    background-position: left top, right bottom, left bottom, right   top;
    animation: border-dance 1s infinite linear;
  }
  @keyframes border-dance {
    0% {
      background-position: left top, right bottom, left bottom, right   top;
    }
    100% {
      background-position: left 15px top, right 15px bottom , left bottom 15px , right   top 15px;
    }
  }

  /* To fix react-notification-component Portal render */
  .react-notification-root  {
    top: 0;
  }
  .notification-item {
    box-shadow: none;
  }

  ${ReactModalStyles}
  ${EmojiMartStyles}
`;

export default GlobalStyles;
