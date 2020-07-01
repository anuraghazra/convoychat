import styled, { css } from "styled-components/macro";

const tiltedBox = css`
  content: "";
  position: absolute;
  top: 15px;
  left: -15px;
  width: inherit;
  height: 270px;
  transform: rotate(-2deg);
  background-color: ${p => p.theme.colors.primary};
  border-radius: ${p => p.theme.radius.small}px;
  z-index: -1;
`;

const HomeWrapper = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: ${p => p.theme.space.xlarge}px;

  &:before,
  &:after {
    content: "";
    position: absolute;
    transform: rotate(-15deg);
    background-color: ${p => p.theme.colors.dark1};
    border-radius: ${p => p.theme.radius.small}px;
  }
  &:before {
    bottom: -50px;
    left: -25px;
    width: 150px;
    height: 270px;
    opacity: 0.5;
    z-index: -1;
  }
  &:after {
    top: -50px;
    right: -25px;
    width: 150px;
    height: 270px;
    opacity: 0.5;
    z-index: -1;
  }

  .wrapper_card {
    position: relative;
    text-align: center;
    margin: auto;
    width: 100%;
    max-width: 500px;
    margin-top: ${p => p.theme.space.huge}px;

    padding: ${p => p.theme.space.huge}px;
    border-radius: ${p => p.theme.radius.small}px;
    background-color: ${p => p.theme.colors.dark1};

    &:before {
      ${tiltedBox}
    }

    h2 {
      margin-bottom: 40px;
    }

    @media (${p => p.theme.media.mobile}) {
      margin-top: 30%;

      &:before {
        top: 15px;
        left: 0px;
      }
    }
  }
`;

export default HomeWrapper;
