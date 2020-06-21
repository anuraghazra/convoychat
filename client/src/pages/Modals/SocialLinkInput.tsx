import React, { useState } from "react";
import styled from "styled-components";
import { FaGithub, FaTwitter, FaInstagram, FaGlobe } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { UserLinks } from "graphql/generated/graphql";
import { Flex, Input } from "@convoy-ui";

const StyledSocialLinkInput = styled(Flex)`
  .custom-select {
    margin-top: 15px;
    width: 120px;
    padding: 10px;
    height: 100%;
    margin: 0;
    border-radius: ${p => p.theme.radius.small}px;
    background-color: ${p => p.theme.colors.dark2};
    color: ${p => p.theme.colors.white};
    border: none;
  }

  form {
    width: 100%;
  }
`;

export type ILinkTypes = keyof Omit<UserLinks, "__typename">;
export const ICON_MAP: Record<ILinkTypes, any> = {
  github: FaGithub,
  twitter: FaTwitter,
  instagram: FaInstagram,
  website: FaGlobe,
};
const SocialLinkInput: React.FC<{ handleSubmit: (e: any) => void }> = ({
  handleSubmit,
}) => {
  const { register, errors, handleSubmit: onSubmit } = useForm<{
    link: string;
  }>();
  const [currentType, setCurrentType] = useState<ILinkTypes>("github");

  // Build the regex
  const urlRegex = new RegExp(
    `^(https?\\:)\\/\\/((${
      currentType === "website" ? "[^:/?#]*" : currentType
    })(?:\\:([0-9]+))?)([\\/]{0,1}[^?#]*)(\\?[^#]*|)(#.*|)$`
  );
  return (
    <StyledSocialLinkInput align="center" gap="medium" nowrap>
      <form
        onSubmit={onSubmit(e => {
          handleSubmit({ type: currentType, value: e.link });
        })}
      >
        <Input
          name="link"
          errors={errors}
          inputRef={register({
            required: true,
            pattern: { value: urlRegex, message: "Invalid URL" },
          })}
          placeholder={`Your ${currentType} link`}
          icon={ICON_MAP[currentType]}
          label={
            <>
              <span>Add social media links</span>
              <small className="textcolor--gray"> (enter to submit)</small>
            </>
          }
        />
      </form>

      <select
        className="custom-select"
        onChange={(e: any) => setCurrentType(e.target.value)}
      >
        <option value="github">Github</option>
        <option value="twitter">Twitter</option>
        <option value="instagram">Instagram</option>
        <option value="website">Website</option>
      </select>
    </StyledSocialLinkInput>
  );
};

export default SocialLinkInput;
