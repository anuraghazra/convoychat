import { css } from 'styled-components';

const ReactModalStyles = css`
  .user-settings__modal {
    width: 600px !important;
    @media (${p => p.theme.media.tablet}) {
      width: 100% !important;
    }
  }
  .ModalContent {
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    margin-right: -50%;
    transform: translate(-50%, -50%);

    width: 500px;
    max-height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
    position: absolute;
    border-radius: 5px;
    padding: 30px 30px;
    border-radius: ${p => p.theme.radius.small}px;
    background-color: ${p => p.theme.colors.dark1};
    &:focus {
      outline: none;
    }

    @media (${p => p.theme.media.tablet}) {
      top: 100%;
      width: 100%;
      border-radius: 0;
      transform: translate(-50%, -100%);
    }
  }

  .ModalOverlay {
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
    transition: 0.3s;
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

export default ReactModalStyles;