import React from "react";

import { useAuthContext } from "contexts/AuthContext";
import useModal from "hooks/useModal";

import { Button, Spacer } from "@convoy-ui";
import SidebarWrapper from "./Sidebar.style";
import UserInfoCard from "components/UserInfoCard";
import ConvoyLogo from "components/ConvoyLogo";
import CreateRoom from "components/CreateRoom";
import RoomsList from "components/RoomsList";

const Sidebar = () => {
  const { user, logout } = useAuthContext();
  const { isOpen, openModal, closeModal } = useModal();

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
      <RoomsList onModalOpen={openModal} />

      <Button onClick={logout}>Logout</Button>

      <CreateRoom isOpen={isOpen} closeModal={closeModal} />
    </SidebarWrapper>
  );
};

export default Sidebar;
