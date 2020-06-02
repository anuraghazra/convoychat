import styled from "styled-components";

export const DashboardWrapper = styled.section`
  display: grid;
  position: relative;
  grid-template-columns: 250px 1fr 250px;
  min-height: 100vh;
`;

export const DashboardBody = styled.section`
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 0;
`;

export const DashboardHeader = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  padding: ${p => p.theme.space.xlarge}px;
  background-color: ${p => p.theme.colors.dark2};
`;

export const SidebarRight = styled.div`
  background-color: ${p => p.theme.colors.dark1};
`;
