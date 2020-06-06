import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import {
  FaUsers,
  FaTimes,
  FaLink,
  FaPaperPlane,
  FaCopy,
  FaSearch,
} from "react-icons/fa";
import { useCreateInvitationLinkMutation } from "graphql/generated/graphql";

import { Button, ButtonGroup, Spacer, Input } from "@convoy-ui";
import { useModalContext } from "contexts/ModalContext";
import { copyToClipboard } from "utils";

type Inputs = {
  roomName: string;
};

interface IInviteMembers {
  roomId: string;
}
const InviteMembers: React.FC<IInviteMembers> = ({ roomId }) => {
  const [inviteLink, setInviteLink] = useState("");
  // let history = useHistory();
  // let { roomId } = useParams();
  const { state, dispatch } = useModalContext();
  const { register, handleSubmit, errors: formErrors } = useForm<Inputs>();

  const [
    createInvitationLink,
    { data: invitationLink },
  ] = useCreateInvitationLinkMutation({
    onCompleted(data) {
      setInviteLink(data.createInvitationLink.link);
    },
  });

  const onSubmit = async (data: Inputs) => {};

  const closeModal = () => {
    dispatch({ type: "CLOSE", modal: "InviteMembers" });
  };

  useEffect(() => {
    if (state.isInviteMembersModalOpen) {
      createInvitationLink({ variables: { roomId } });
    }
  }, [state.isInviteMembersModalOpen, roomId]);

  return (
    <Modal
      isOpen={state.isInviteMembersModalOpen}
      closeTimeoutMS={300}
      onRequestClose={closeModal}
      contentLabel="Create New Room"
      className="ModalContent"
      overlayClassName="ModalOverlay"
    >
      <h2>Invite Members</h2>
      <small className="textcolor--gray">yeah... yeah spam them</small>

      <Spacer gap="huge" />

      <Input
        value={inviteLink}
        onChange={() => {}}
        type="text"
        label="Copy Invitation Link"
        placeholder="invitation link"
        icon={FaLink}
        postfixIcon={FaCopy}
        onPostfixIconClick={e => copyToClipboard(e.value)}
      />

      <Spacer gap="large" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          name="username"
          label="Find Users"
          placeholder="bear grylls"
          icon={FaSearch}
          errors={formErrors}
          inputRef={register({ required: "Username is required" })}
        />

        <ButtonGroup gap="medium" float="right">
          <Button onClick={closeModal} variant="danger" icon={FaTimes}>
            Cancel
          </Button>
          <Button icon={FaPaperPlane}>Invite members</Button>
        </ButtonGroup>
      </form>
    </Modal>
  );
};

export default React.memo(InviteMembers);
