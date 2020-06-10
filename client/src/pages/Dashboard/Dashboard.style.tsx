import styled from "styled-components";

export const DashboardWrapper = styled.section`
  display: grid;
  position: relative;
  grid-template-columns: 250px 1fr 250px;
  min-height: 100vh;

  @media (${p => p.theme.media.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const DashboardBody = styled.section`
  height: 100vh;
  overflow-y: hidden;
  overflow-x: hidden;
  padding: 0;
`;

export const DashboardHeader = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  padding: ${p => p.theme.space.xlarge}px;
  background-color: ${p => p.theme.colors.dark2};
  z-index: 3;

  @media (${p => p.theme.media.tablet}) {
    position: fixed;
  }
`;

export const SidebarRight = styled.div`
  background-color: ${p => p.theme.colors.dark1};
`;
