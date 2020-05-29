import React from "react";
import LoginWrapper from "./Login.style";
import { initOAuthWindow } from "src/utils";
import { useHistory } from "react-router-dom";

function Login() {
  const history = useHistory();

  const onSuccess = () => {
    history.push("/");
  };

  return (
    <LoginWrapper>
      <button onClick={initOAuthWindow(onSuccess)}>Continue with Google</button>
    </LoginWrapper>
  );
}

export default Login;
