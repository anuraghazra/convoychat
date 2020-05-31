import React from "react";
import styled, { css } from "styled-components";

import { AiFillSetting } from "react-icons/ai";
import { Flex } from "@convoy-ui";

const StyledUserInfoCard = styled.section<{ isMember?: boolean }>`
  padding: 10px 0;

  ${p =>
    !p.isMember &&
    css`
      padding: 20px;
      background-color: ${p => p.theme.colors.dark1};
    `}
`;

interface IUserInfoCard {
  image?: string;
  name?: string;
  username?: string;
  className?: string;
  isMember?: boolean;
}

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50px;
`;

const UserInfoCard: React.FC<IUserInfoCard> = ({
  image,
  name,
  username,
  className,
  isMember,
}) => {
  return (
    <StyledUserInfoCard isMember={isMember} className={className}>
      <Flex gap="medium" justify={isMember ? "" : "space-around"} align="center">
        <Avatar src={image} />
        <Flex direction="column">
          <span>{name}</span>
          <small className="textcolor--gray">{username?.slice(0, 10)}...</small>
        </Flex>
        {!isMember && <AiFillSetting size={20} />}
      </Flex>
    </StyledUserInfoCard>
  );
};

export default UserInfoCard;
