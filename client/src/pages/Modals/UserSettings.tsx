/// <reference types="styled-components/cssprop" />
import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components/macro";
import { FaTimes, FaSave } from "react-icons/fa";
import Modal from "react-modal";

import Message from "components/Message/Message";
import { useModalContext } from "contexts/ModalContext";
import { useAuthContext } from "contexts/AuthContext";

import {
  UserLinks,
  useSetUserSettingsMutation,
} from "graphql/generated/graphql";
import { Button, ButtonGroup, Spacer } from "@convoy-ui";
import ColorPreview from "components/ColorPreview";
import SocialLinkInput, { ILinkTypes } from "./SocialLinkInput";
import SocialLink from "./SocialLink";

const UserSettings: React.FC = () => {
  const { user } = useAuthContext();
  const { state, dispatch } = useModalContext();
  const [color, setColor] = useState<string>("");
  const [socialLinks, setSocialLinks] = useState<Omit<UserLinks, "__typename">>(
    {}
  );

  const handleSocialLinks = (e: any) => {
    setSocialLinks({ ...socialLinks, [e.type]: e.value });
  };
  const handleColorChange = (color: any) => {
    setColor(color.hex);
  };
  const closeModal = () => dispatch({ modal: "UserSettings", type: "CLOSE" });

  const [setUserSettings, { loading }] = useSetUserSettingsMutation({
    onError(err) {
      console.log(err);
    },
    onCompleted() {
      // closeModal();
    },
  });

  useEffect(() => {
    setColor(user?.color);
    setSocialLinks({
      github: user?.links?.github,
      twitter: user?.links?.twitter,
      instagram: user?.links?.instagram,
      website: user?.links?.website,
    });
  }, [user?.color, user?.links]);

  const onSubmit = () => {
    setUserSettings({
      variables: {
        color: color,
        ...socialLinks,
      },
    });
  };

  return (
    <Modal
      isOpen={state.isUserSettingsModalOpen}
      closeTimeoutMS={300}
      onRequestClose={closeModal}
      contentLabel="User Settings"
      className="ModalContent"
      style={{ content: { width: 600 } }}
      overlayClassName="ModalOverlay"
    >
      <h2>User Settings</h2>
      <small className="textcolor--gray">
        Who does not loves a useless modal
      </small>
      <Spacer gap="xlarge" />

      <div>
        <p style={{ fontSize: 14 }}>Add your personal color</p>

        <ColorPreview
          color={color}
          handleColorChange={handleColorChange}
          preview={
            <Message
              id="123"
              author={{ ...user, color: color }}
              content="Hello world"
              date={"6/21/2020"}
            />
          }
        />
        <Spacer gap="huge" />

        <SocialLinkInput handleSubmit={handleSocialLinks} />

        <Spacer gap="xlarge" />
        <section
          css={css`
            display: grid;
            grid-gap: 10px;
            grid-template-columns: repeat(3, minmax(0, 1fr));
          `}
        >
          {Object.keys(socialLinks).map((type: ILinkTypes) => {
            return socialLinks[type] ? (
              <SocialLink
                type={type}
                url={socialLinks[type]}
                onDelete={() => {
                  setSocialLinks({
                    ...socialLinks,
                    [type]: null,
                  });
                }}
              />
            ) : null;
          })}
        </section>

        <Spacer gap="huge" />

        <ButtonGroup gap="medium" float="right">
          <Button onClick={closeModal} variant="danger" icon={FaTimes}>
            Cancel
          </Button>
          <Button isLoading={loading} onClick={onSubmit} icon={FaSave}>
            Save Changes
          </Button>
        </ButtonGroup>
      </div>
    </Modal>
  );
};

export default UserSettings;
