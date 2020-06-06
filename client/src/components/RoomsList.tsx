import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import { useListCurrentUserRoomsQuery } from "graphql/generated/graphql";

import { Flex, Spacer } from "@convoy-ui";
import { useModalContext } from "contexts/ModalContext";

import Loading from "components/Loading";
import RoomLink from "components/RoomLink";
import InviteMembers from "pages/Modals/InviteMembers";

const RoomsList: React.FC = () => {
  const { dispatch } = useModalContext();
  const [modalRoomId, setModalRoomId] = useState<string>("");
  const { data: rooms, loading, error } = useListCurrentUserRoomsQuery();

  return (
    <section>
      <InviteMembers roomId={modalRoomId} />

      <Flex align="center" justify="space-between">
        <h3>Your Rooms</h3>
        <MdAdd
          onClick={() => dispatch({ type: "OPEN", modal: "CreateRoom" })}
        />
      </Flex>
      <Spacer gap="large" />

      {loading && <Loading />}
      {error && <span>Error Loading Rooms</span>}
      {rooms?.listCurrentUserRooms?.map((room, index) => {
        return (
          <RoomLink
            id={room.id}
            key={room.id}
            name={room.name}
            isSelected={false}
            onInviteMemberClick={roomId => setModalRoomId(roomId)}
          />
        );
      })}
    </section>
  );
};

export default RoomsList;
