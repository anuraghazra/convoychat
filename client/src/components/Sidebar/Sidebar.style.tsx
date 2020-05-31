import styled from "styled-components";

const SidebarWrapper = styled.aside`
  padding: 20px;
  background-color: ${p => p.theme.colors.dark2};

  .logo {
    margin-bottom: 50px;
  }

  .sidebar__rooms {
    margin-top: ${p => p.theme.space.huge}px;
  }
  .sidebar--margin-adjust {
    margin-left: -20px;
    margin-right: -20px;
    margin-bottom: ${p => p.theme.space.large}px;
  }
`;

export default SidebarWrapper;
