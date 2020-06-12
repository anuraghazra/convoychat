import React from "react";
import { Switch } from "react-router-dom";

import Room from "pages/Room/Room";
import Sidebar from "react-sidebar";
import AuthRoute from "components/AuthRoute";
import { DashboardWrapper } from "./Dashboard.style";
import SidebarContent from "components/Sidebar/Sidebar";
import useResponsiveSidebar from "hooks/useResponsiveSidebar";

const Dashboard = () => {
  const { isDocked, isOpen, setIsOpen } = useResponsiveSidebar({
    initialOpen: true,
  });

  return (
    <DashboardWrapper>
      <Sidebar
        touch
        defaultSidebarWidth={isDocked ? 200 : 350}
        sidebar={<SidebarContent />}
        docked={isDocked}
        styles={{
          sidebar: {
            width: "300px",
            overflow: "visible",
          },
        }}
        open={isOpen}
        onSetOpen={setIsOpen}
      >
        <Switch>
          <AuthRoute path="/room/:roomId" component={Room} />
        </Switch>
      </Sidebar>
    </DashboardWrapper>
  );
};

export default Dashboard;
