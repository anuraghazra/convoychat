import React from "react";
import styled from "styled-components";

const StyledWelcome = styled.section`
  padding: 20px;
`;

const Welcome: React.FC = () => {
  return <StyledWelcome>Welcome to ConvoyChat</StyledWelcome>;
};

export default Welcome;
