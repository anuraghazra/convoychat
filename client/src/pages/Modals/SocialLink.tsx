import React from "react";
import styled, { CSSProp, css } from "styled-components";
import { FaTimes } from "react-icons/fa";
import { Flex } from "@convoy-ui";
import { ILinkTypes, ICON_MAP } from "./SocialLinkInput";

const SocialLinkStyles: Record<ILinkTypes, CSSProp> = {
  twitter: css`
    background-color: #00acee;
  `,
  github: css`
    background-color: white;
    color: ${p => p.theme.colors.dark3};
  `,
  instagram: css`
    background-color: #d72978;
  `,
  website: css`
    background-color: white;
    color: ${p => p.theme.colors.dark3};
  `,
};
const StyledSocialLink = styled(Flex)<{ type: ILinkTypes }>`
  padding: ${p => p.theme.space.medium}px;
  border-radius: ${p => p.theme.radius.small}px;
  height: 40px;

  a {
    color: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  ${p => SocialLinkStyles[p.type]}
`;

function getLocation(href: string) {
  var match = href.match(
    /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
  );
  return (
    match && {
      href: href,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}

const SocialLink: React.FC<{
  url: string;
  type: ILinkTypes;
  onDelete: () => void;
}> = ({ url, type, onDelete }) => {
  const username = getLocation(url);

  return (
    <StyledSocialLink align="center" gap="large" nowrap type={type}>
      {ICON_MAP[type]()}
      <a href={url}>{username?.pathname?.replace("/", "") || url}</a>
      <FaTimes onClick={onDelete} />
    </StyledSocialLink>
  );
};

export default SocialLink;
