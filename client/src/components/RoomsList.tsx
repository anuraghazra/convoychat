import React from "react";
import { MdAdd } from "react-icons/md";
import { useListCurrentUserRoomsQuery } from "graphql/generated/graphql";

import { Flex, Spacer } from "@convoy-ui";
import Loading from "components/Loading";
import RoomLink from "components/RoomLink";

const RoomsList: React.FC<{ onModalOpen: () => void }> = ({ onModalOpen }) => {
  const { data: rooms, loading, error } = useListCurrentUserRoomsQuery();

  return (
    <section>
      <Flex align="center" justify="space-between">
        <h3>Your Rooms</h3>
        <MdAdd onClick={onModalOpen} />
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
          />
        );
      })}
    </section>
  );
};

export default RoomsList;
