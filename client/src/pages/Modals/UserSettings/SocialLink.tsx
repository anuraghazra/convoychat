import React from "react";
import DOMPurify from "dompurify";
import { sanitizeUrl } from "@braintree/sanitize-url";
import styled, { CSSProp, css } from "styled-components";
import { FaTimes } from "react-icons/fa";

import { parseURL } from "utils";
import { Flex, IconButton } from "@convoy-ui";
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
    width: 100%;
    color: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  .sociallink__icon {
    &,
    & > svg {
      width: 18px;
      height: 18px;
    }
  }
  .icon__button {
    &:hover {
      color: inherit;
    }
    margin-left: auto;
  }

  ${p => SocialLinkStyles[p.type]}
`;

interface ISocialLink {
  url: string;
  type: ILinkTypes;
  onDelete: () => void;
}
const SocialLink: React.FC<ISocialLink> = ({ url, type, onDelete }) => {
  let { pathname = url } = parseURL(url) || {};

  if (type === "website") pathname = url;

  return (
    <StyledSocialLink align="center" gap="large" nowrap type={type}>
      <div className="sociallink__icon">{ICON_MAP[type]()}</div>
      <a href={sanitizeUrl(url)}>
        {DOMPurify.sanitize(pathname?.replace(/^\//, ""))}
      </a>
      <IconButton icon={<FaTimes />} onClick={onDelete} />
    </StyledSocialLink>
  );
};

export default SocialLink;
