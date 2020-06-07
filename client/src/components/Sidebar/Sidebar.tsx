import React from "react";

import { useAuthContext } from "contexts/AuthContext";

import { Button, Spacer } from "@convoy-ui";
import SidebarWrapper from "./Sidebar.style";
import UserInfoCard from "components/UserInfoCard";
import ConvoyLogo from "components/ConvoyLogo";
import RoomsList from "components/RoomsList";

const Sidebar = () => {
  const { user, logout } = useAuthContext();

  return (
    <SidebarWrapper>
      <ConvoyLogo className="logo" />
      <UserInfoCard
        name={user?.name}
        image={user?.avatarUrl}
        username={user?.username}
        className="sidebar--margin-adjust"
      />

      <Spacer gap="huge" />
      <RoomsList />

      <Button onClick={logout}>Logout</Button>
    </SidebarWrapper>
  );
};

export default Sidebar;
