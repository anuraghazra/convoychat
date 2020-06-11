import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import { FaUsers, FaTrash, FaUserPlus } from "react-icons/fa";
import {
  useDeleteRoomMutation,
  ListCurrentUserRoomsDocument,
} from "graphql/generated/graphql";

import { Flex, Button, Dropdown, IconButton } from "@convoy-ui";
import { useModalContext } from "contexts/ModalContext";

const StyledRoomLink = styled.div<{ isSelected?: boolean }>`
  padding: 10px 20px;
  padding-right: 10px;
  margin-bottom: ${p => p.theme.space.small}px;
  border-radius: ${p => p.theme.radius.small}px;
  background-color: ${p => p.theme.colors.dark3};
  color: ${p => (p.isSelected ? p.theme.colors.primary : p.theme.colors.white)};
  a {
    color: inherit;
  }
  &:hover {
    color: ${p => p.theme.colors.primary};
  }
`;

interface IRoomLink {
  name: string;
  id: string;
  isSelected?: boolean;
  onInviteMemberClick?: (roomId: string) => void;
}
const RoomLink: React.FC<IRoomLink> = ({
  name,
  id,
  isSelected,
  onInviteMemberClick,
}) => {
  const { dispatch } = useModalContext();
  const [deleteRoom, { loading: isDeleting, error }] = useDeleteRoomMutation({
    refetchQueries: [{ query: ListCurrentUserRoomsDocument }],
  });

  const handleDelete = () => {
    deleteRoom({
      variables: {
        roomId: id,
      },
    }).catch(console.log);
  };

  const handleAddMembers = () => {
    dispatch({ type: "OPEN", modal: "InviteMembers" });
    onInviteMemberClick(id);
  };

  return (
    <StyledRoomLink isSelected={isSelected}>
      <Flex align="center" justify="space-between" nowrap>
        <Link to={`/room/${id}`}>
          <Flex gap="medium" align="center" nowrap>
            <FaUsers />
            <span>{name}</span>
          </Flex>
        </Link>

        <Dropdown>
          <Dropdown.Toggle>
            <IconButton icon={<FiMoreVertical />} />
          </Dropdown.Toggle>
          <Dropdown.Content style={{ right: "initial", padding: "0 10px" }}>
            <Flex direction="column" gap="none">
              <Button
                variant="secondary"
                onClick={handleAddMembers}
                icon={FaUserPlus}
              >
                Add Members
              </Button>
              <Button
                variant="danger"
                isLoading={isDeleting}
                onClick={handleDelete}
                icon={FaTrash}
              >
                Delete
              </Button>
            </Flex>
          </Dropdown.Content>
        </Dropdown>
      </Flex>
    </StyledRoomLink>
  );
};

export default React.memo(RoomLink);
