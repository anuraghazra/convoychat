import React from "react";
import styled from "styled-components";
import { Avatar, Flex, IconButton, Tooltip } from "@convoy-ui";
import { RoomMemberFragment } from "graphql/generated/graphql";
import { FiUserMinus } from "react-icons/fi";
import { useAuthContext } from "contexts/AuthContext";

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
  const { user: currentUser } = useAuthContext();
  const isCurrentUser = currentUser.id === user.id;

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

        {!isCurrentUser && (
          <Tooltip
            placement="top-left"
            message={<span>Remove member from group</span>}
          >
            <IconButton
              icon={<FiUserMinus />}
              onClick={() => onActionClick(user)}
            />
          </Tooltip>
        )}
      </Flex>
    </StyledMember>
  );
};

export default Member;
