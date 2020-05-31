import styled from "styled-components";

export const DashboardWrapper = styled.section`
  display: grid;
  position: relative;
  grid-template-columns: 250px 1fr 250px;
  min-height: 100vh;
`;

export const DashboardBody = styled.section`
  padding: ${p => p.theme.space.large}px;
`;

export const SidebarRight = styled.div`
  background-color: ${p => p.theme.colors.dark1};
`;
