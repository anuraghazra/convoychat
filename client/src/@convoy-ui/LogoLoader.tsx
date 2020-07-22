import React from "react";
import { Flex, Spacer } from "@convoy-ui";
import Logo from "assets/logo.png";
import styled from "styled-components";

const StyledConvoyChatLoader = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const LineLoader = styled.div`
  position: relative;
  width: 200px;
  height: 3px;
  overflow: hidden;
  border-radius: 10px;
  background-color: ${p => p.theme.colors.gray};

  &:before {
    content: "";
    position: absolute;
    transform: translateX(0);
    border-radius: 10px;
    width: 100%;
    height: 3px;
    background-color: ${p => p.theme.colors.primary};
    animation: line-loader 1s infinite;
  }

  @keyframes line-loader {
    0% {
      transform: translateX(-200px);
    }
    50% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(200px);
    }
  }
`;

export const ConvoyChatLoader = () => {
  return (
    <StyledConvoyChatLoader>
      <Flex align="center" direction="column">
        <img width="150px" src={Logo} alt="ConvoyChat logo" />
        <Spacer gap="large" />
        <LineLoader />
      </Flex>
    </StyledConvoyChatLoader>
  );
};

export default ConvoyChatLoader;
