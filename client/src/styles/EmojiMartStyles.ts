import { css } from "styled-components";

const EmojiMartStyles = css`
  /*
  * Dark mode styles
  */

  .emoji-mart-dark {
    color: #fff;
    border-color: ${p => p.theme.colors.dark2};
    background-color: ${p => p.theme.colors.dark1};
  }

  .emoji-mart-dark .emoji-mart-bar {
    border-color: ${p => p.theme.colors.dark2};
  }

  .emoji-mart-dark .emoji-mart-search input {
    color: #fff;
    border-color: ${p => p.theme.colors.dark2};
    background-color: ${p => p.theme.colors.dark3};
  }

  .emoji-mart-dark .emoji-mart-search-icon svg {
    fill: #fff;
  }

  .emoji-mart-dark .emoji-mart-category .emoji-mart-emoji:hover:before {
    background-color: ${p => p.theme.colors.dark3};
  }

  .emoji-mart-dark .emoji-mart-category-label span {
    background-color: ${p => p.theme.colors.dark1};
    color: #fff;
  }

  .emoji-mart-dark .emoji-mart-skin-swatches {
    border-color: ${p => p.theme.colors.dark2};
    background-color: ${p => p.theme.colors.dark1};
  }

  .emoji-mart-dark .emoji-mart-anchor:hover,
  .emoji-mart-dark .emoji-mart-anchor:focus,
  .emoji-mart-dark .emoji-mart-anchor-selected {
    color: ${p => p.theme.colors.white};
  }
`;

export default EmojiMartStyles;
