import styled from "styled-components";

const SidebarWrapper = styled.aside`
  padding: 20px;
  background-color: ${p => p.theme.colors.dark2};
  height: 100%;
  z-index: 3;
  overflow-x: visible;
  
  .logo {
    margin-bottom: 50px;
  }

  .sidebar--margin-adjust {
    margin-left: -20px;
    margin-right: -20px;
    margin-bottom: ${p => p.theme.space.large}px;
  }
`;

export default SidebarWrapper;
