import React, { useState } from "react";
import styled, { css } from "styled-components";

import { Flex, Avatar } from "@convoy-ui";
import { Member as IMember } from "graphql/generated/graphql";

const StyledMemberItem = styled.div<{ isSelected?: boolean }>`
  background-color: ${p => p.theme.colors.dark3};
  padding: ${p => p.theme.space.medium}px;
  border-radius: ${p => p.theme.radius.small}px;
  border: 1px solid ${p => p.theme.colors.dark1};
  font-size: 14px;
  cursor: pointer;

  ${p =>
    p.isSelected &&
    css`
      color: ${p.theme.colors.primary};
      border: 1px solid ${p.theme.colors.primary};
    `}
`;

const StyledMemberSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: ${p => p.theme.space.medium}px;
`;

interface IMemberItem {
  id: string;
  image: string;
  isSelected?: boolean;
  username: string;
  name: string;
  onClick?: (id: string) => void;
}
const MemberItem: React.FC<IMemberItem> = ({
  id,
  image,
  isSelected,
  username,
  name,
  onClick,
}) => {
  return (
    <StyledMemberItem isSelected={isSelected} onClick={() => onClick(id)}>
      <Flex gap="medium" align="center" nowrap>
        <Avatar size={35} src={image} />
        <span>{name}</span>
      </Flex>
    </StyledMemberItem>
  );
};

interface IMemberSelector {
  members: IMember[];
  selectedMembers?: any;
  onMemberClick?: (member: IMember) => void;
}
const MemberSelector: React.FC<IMemberSelector> = ({
  members,
  selectedMembers,
  onMemberClick,
}) => {
  return (
    <StyledMemberSelector>
      {members.map(member => {
        return (
          <MemberItem
            key={member.id}
            id={member.id}
            name={member.name}
            image={member.avatarUrl}
            username={member.username}
            isSelected={!!selectedMembers[member.id]}
            onClick={() => onMemberClick(member)}
          />
        );
      })}
    </StyledMemberSelector>
  );
};

export default MemberSelector;
