import React from "react";
import LoginWrapper from "./Login.style";
import { initOAuthWindow } from "utils";
import { useHistory } from "react-router-dom";
import { Button, Flex } from "@convoy-ui";
import ConvoyLogo from "components/ConvoyLogo";

function Login() {
  const history = useHistory();

  const onSuccess = () => {
    history.push("/");
  };

  return (
    <LoginWrapper>
      <ConvoyLogo />
      <div className="login__card">
        <h2>
          Stay <span className="textcolor--primary">Connected</span>
        </h2>
        <p>
          I know nobody would bother to login if i don’t provide social login :(
        </p>
        <Button onClick={initOAuthWindow(onSuccess)}>
          Continue with Google
        </Button>
      </div>
    </LoginWrapper>
  );
}

export default Login;
