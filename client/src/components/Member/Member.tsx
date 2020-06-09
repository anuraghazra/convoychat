import React from "react";
import styled from "styled-components";
import { Avatar, Flex } from "@convoy-ui";
import { Member as IMember } from "graphql/generated/graphql";

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
`;

interface MemberProps {
  user: IMember;
  onRightClick?: (useId?: IMember) => void;
}
const Member: React.FC<MemberProps> = ({ user, onRightClick }) => {
  const handleClick = (e: any) => {
    if (e.nativeEvent.which === 3) {
      onRightClick(user);
    }
  };

  const preventContextMenu = (e: any) => {
    e.preventDefault();
  };

  return (
    <StyledMember
      onMouseDown={handleClick}
      onContextMenuCapture={preventContextMenu}
    >
      <Flex gap="medium" align="center">
        <Avatar size={35} src={user?.avatarUrl} />
        <Flex direction="column">
          <span className="userinfo__displayname">{user?.name}</span>
          <small className="textcolor--gray" title={user?.username}>
            {user?.username?.slice(0, 15)}...
          </small>
        </Flex>
      </Flex>
    </StyledMember>
  );
};

export default Member;
