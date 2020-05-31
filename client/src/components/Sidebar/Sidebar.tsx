import React from "react";
import { MdAdd } from "react-icons/md";

import { Button, Flex, Spacer } from "@convoy-ui";
import { useAuthContext } from "contexts/AuthContext";
import useModal from "hooks/useModal";

import SidebarWrapper from "./Sidebar.style";
import UserInfoCard from "components/UserInfoCard";
import ConvoyLogo from "components/ConvoyLogo";
import RoomLink from "components/RoomLink";
import CreateRoom from "components/CreateRoom";

const Sidebar = () => {
  const { user, logout } = useAuthContext();
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <SidebarWrapper>
      <ConvoyLogo className="logo" />
      <UserInfoCard
        className="sidebar--margin-adjust"
        image={user?.avatarUrl}
        name={user?.name}
        username={user?.username}
      />

      <section className="sidebar__rooms">
        <Flex align="center" justify="space-between">
          <h3>Your Rooms</h3>
          <MdAdd onClick={openModal} />
        </Flex>
        <Spacer gap="large" />

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

      <CreateRoom isOpen={isOpen} closeModal={closeModal} />
    </SidebarWrapper>
  );
};

export default Sidebar;
