import styled from "styled-components";

const HorizontalShade = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 3px;
  background-color: ${p => p.theme.colors.primary};
  z-index: 5; 
`;

export default HorizontalShade;
