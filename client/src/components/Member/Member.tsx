import React from "react";
import styled from "styled-components";
import { Avatar, Flex, IconButton } from "@convoy-ui";
import { RoomMemberFragment } from "graphql/generated/graphql";
import { FiUserMinus } from "react-icons/fi";

const StyledMember = styled.section`
  padding: 15px;
  margin-left: -15px;
  margin-right: -15px;

  &:hover {
    background-color: ${p => p.theme.colors.dark1};
  }
  .userinfo__displayname {
    font-size: 14px;
  }

  svg {
    cursor: pointer;
  }
`;

interface MemberProps {
  user: RoomMemberFragment;
  onActionClick?: (useId?: RoomMemberFragment) => void;
}
const Member: React.FC<MemberProps> = ({ user, onActionClick }) => {
  return (
    <StyledMember>
      <Flex gap="medium" align="center" justify="space-between" nowrap>
        <Flex gap="medium" align="center">
          <Avatar size={35} src={user?.avatarUrl} />
          <Flex direction="column" nowrap>
            <span className="userinfo__displayname">{user?.name}</span>
            <small className="textcolor--gray" title={user?.username}>
              {user?.username?.slice(0, 15)}...
            </small>
          </Flex>
        </Flex>

        <IconButton
          onClick={() => onActionClick(user)}
          icon={<FiUserMinus />}
        />
      </Flex>
    </StyledMember>
  );
};

export default Member;
