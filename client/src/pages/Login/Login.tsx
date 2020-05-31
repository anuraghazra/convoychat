import React from "react";
import { FaGoogle } from "react-icons/fa";

import { Button } from "@convoy-ui";
import { initOAuthWindow } from "utils";
import { useAuthContext } from "contexts/AuthContext";

import ConvoyLogo from "components/ConvoyLogo";
import LoginWrapper from "./Login.style";

function Login() {
  const { login } = useAuthContext();

  const onSuccess = () => {
    login();
  };

  return (
    <LoginWrapper>
      <ConvoyLogo />
      <div className="login__card">
        <div>
          <h2>
            Stay <span className="textcolor--primary">Connected</span>
          </h2>
          <p>
            I know nobody would bother to login if i don’t provide social login
            :(
          </p>
          <Button icon={FaGoogle} onClick={initOAuthWindow(onSuccess)}>
            Continue with Google
          </Button>
        </div>
      </div>
    </LoginWrapper>
  );
}

export default Login;
