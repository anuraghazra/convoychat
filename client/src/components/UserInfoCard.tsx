import React from "react";
import styled, { css } from "styled-components";

import { AiFillSetting } from "react-icons/ai";
import { Flex, Avatar } from "@convoy-ui";

const StyledUserInfoCard = styled.section<{ isMember?: boolean }>`
  padding: 10px 0;

  ${p =>
    !p.isMember &&
    css`
      padding: 20px;
      background-color: ${p => p.theme.colors.dark1};
    `}

  .userinfo__displayname {
    font-size: 14px;
  }
`;

interface IUserInfoCard {
  image?: string;
  name?: string;
  username?: string;
  className?: string;
  isMember?: boolean;
}

const UserInfoCard: React.FC<IUserInfoCard> = ({
  image,
  name,
  username,
  className,
  isMember,
}) => {
  return (
    <StyledUserInfoCard isMember={isMember} className={className}>
      <Flex
        gap="medium"
        justify={isMember ? "" : "space-around"}
        align="center"
      >
        <Avatar size={35} src={image} />
        <Flex direction="column">
          <span className="userinfo__displayname">{name}</span>
          <small className="textcolor--gray" title={username}>
            {username?.slice(0, 15)}...
          </small>
        </Flex>
        {!isMember && <AiFillSetting size={20} />}
      </Flex>
    </StyledUserInfoCard>
  );
};

export default UserInfoCard;
