import React from "react";
import { Switch } from "react-router-dom";

import { DashboardWrapper } from "./Dashboard.style";
import AuthRoute from "components/AuthRoute";
import Sidebar from "components/Sidebar/Sidebar";
import Room from "pages/Room/Room";

const Dashboard = () => {
  return (
    <DashboardWrapper>
      <Sidebar />
      <Switch>
        <AuthRoute path="/room/:roomId" component={Room} />
      </Switch>
    </DashboardWrapper>
  );
};

export default Dashboard;
