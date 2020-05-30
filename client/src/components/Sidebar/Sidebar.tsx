import React from "react";

import { Button } from "@convoy-ui";
import { useAuthContext } from "contexts/AuthContext";

import SidebarWrapper from "./Sidebar.style";
import UserInfoCard from "components/UserInfoCard";
import ConvoyLogo from "components/ConvoyLogo";
import RoomLink from "components/RoomLink";

const Sidebar = () => {
  const { user, logout } = useAuthContext();

  return (
    <SidebarWrapper>
      <ConvoyLogo className="logo" />
      <UserInfoCard
        className="sidebar--margin-adjust"
        image={user?.avatarUrl ?? ""}
        name={user?.name}
        username={user?.username}
      />

      <section className="sidebar__rooms">
        <h3>Your Rooms</h3>
        <br />
        {user?.rooms?.map(room => {
          return (
            <RoomLink
              id={room.id}
              key={room.id}
              name={room.name}
              isSelected={false}
            />
          );
        })}
      </section>

      <Button onClick={logout}>Logout</Button>
    </SidebarWrapper>
  );
};

export default Sidebar;
