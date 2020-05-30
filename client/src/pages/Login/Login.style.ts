import styled, { css } from "styled-components/macro";

const tiltedBox = css`
  content: '';
  position: absolute;
  top: 15px;
  left: -15px;
  width: inherit;
  height: 270px;
  transform: rotate(-2deg);
  background-color: ${p => p.theme.colors.primary};
  border-radius: ${p => p.theme.radius.small}px;
  z-index: -1;
`

const LoginWrapper = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: ${p => p.theme.space.xlarge}px;

  &:before, &:after {
    content: '';
    position: absolute;
    transform: rotate(-15deg);
    background-color: ${p => p.theme.colors.dark};
    border-radius: ${p => p.theme.radius.small}px;
  }
  &:before {
    bottom: -50px;
    left: -25px;
    width: 150px;
    height: 270px;
  }
  &:after {
    top: -50px;
    right: -25px;
    width: 150px;
    height: 270px;
  }
  
  .login__card {
    position: relative;
    text-align: center;
    margin: auto;
    width: 500px;
    margin-top: ${p => p.theme.spacings.top}px;
    
    padding: ${p => p.theme.space.huge}px;
    border-radius: ${p => p.theme.radius.small}px;
    background-color: ${p => p.theme.colors.dark};
    
    &:before {
      ${tiltedBox}
    }

    h2 {
      margin-bottom: 40px;
    }
  }
`;

export default LoginWrapper;
