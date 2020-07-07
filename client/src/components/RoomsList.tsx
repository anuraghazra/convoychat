import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import { useHistory } from "react-router-dom";
import ContentLoader from "react-content-loader";

import { useListCurrentUserRoomsQuery } from "graphql/generated/graphql";

import { useModalContext } from "contexts/ModalContext";
import { Flex, Spacer, IconButton, Tooltip } from "@convoy-ui";

import theme from "styles/theme";
import RoomLink from "components/RoomLink";
import InviteMembers from "pages/Modals/InviteMembers";

const RoomsList: React.FC = () => {
  const history = useHistory();
  const { dispatch } = useModalContext();
  const [modalRoomId, setModalRoomId] = useState<string>("");

  const { data, loading, error } = useListCurrentUserRoomsQuery({
    onCompleted(data) {
      // redirect to first room on the list on initial load
      if (
        history.location.pathname === "/" &&
        data.currentUserRooms.length > 1
      ) {
        history.push(`/room/${data.currentUserRooms[0].id}`);
      }
    },
  });

  return (
    <section>
      <InviteMembers roomId={modalRoomId} />

      <Flex align="center" justify="space-between">
        <h3>Your Rooms</h3>
        <Tooltip placement="top" message={<span>Create new room</span>}>
          <IconButton
            onClick={() => dispatch({ type: "OPEN", modal: "CreateRoom" })}
            icon={<MdAdd />}
          />
        </Tooltip>
      </Flex>
      <Spacer gap="large" />

      {loading && <Loader />}
      {error && <span>Error Loading Rooms</span>}
      {data?.currentUserRooms?.map(room => {
        return (
          <RoomLink
            id={room.id}
            key={room.id}
            name={room.name}
            isSelected={!!history.location.pathname.match(room.id)}
            onInviteMemberClick={roomId => setModalRoomId(roomId)}
          />
        );
      })}
    </section>
  );
};

const Loader: React.FC = () => (
  <ContentLoader
    speed={2}
    width="100%"
    backgroundColor={theme.colors.dark1}
    foregroundColor={theme.colors.dark2}
  >
    <rect y="0" rx="5" ry="5" height="40" width="100%" />
    <rect y="55" rx="5" ry="5" height="40" width="100%" />
    <rect y="110" rx="5" ry="5" height="40" width="100%" />
  </ContentLoader>
);

export default RoomsList;
