import styled from "styled-components/macro";

const LoginWrapper = styled.div`
  height: 100vh;
  display: flex;

  .login__card {
    text-align: center;
    margin: auto;
    width: 500px;
    padding: ${p => p.theme.space.huge}px;
    border-radius: ${p => p.theme.radius.small}px;
    background-color: ${p => p.theme.colors.dark};

    h2 {
      margin-bottom: ${p => p.theme.spacings.bottom}px;
    }
  }
`;

export default LoginWrapper;
