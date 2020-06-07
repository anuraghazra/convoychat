import React from "react";
import { FaGoogle } from "react-icons/fa";
import { useHistory } from "react-router-dom";

import { Button, toast } from "@convoy-ui";
import { initOAuthWindow } from "utils";
import { useAuthContext } from "contexts/AuthContext";

import ConvoyLogo from "components/ConvoyLogo";
import HomeWrapper from "../HomeWrapper.style";

function Login() {
  const { login } = useAuthContext();

  const onSuccess = () => {
    login();
    toast.success("Logged in successfully");
  };

  return (
    <HomeWrapper>
      <ConvoyLogo />
      <div className="wrapper_card">
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
    </HomeWrapper>
  );
}

export default Login;
