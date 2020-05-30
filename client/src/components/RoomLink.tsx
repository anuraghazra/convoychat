import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { FiMoreVertical } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";
import { Flex } from "@convoy-ui";

const StyledRoomLink = styled.div<{ isSelected?: boolean }>`
  background-color: ${p => p.theme.colors.darkest};
  padding: 10px 20px;
  margin-bottom: ${p => p.theme.space.small}px;
  border-radius: ${p => p.theme.radius.small}px;

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
}
const RoomLink: React.FC<IRoomLink> = ({ name, id, isSelected }) => {
  return (
    <StyledRoomLink isSelected={isSelected}>
      <Flex align="center" justify="space-between" nowrap>
        <Link to={`/room/${id}`}>
          <Flex gap="medium" align="center" nowrap>
            <FaUsers />
            <span>{name}</span>
          </Flex>
        </Link>
        <FiMoreVertical />
      </Flex>
    </StyledRoomLink>
  );
};

export default RoomLink;
