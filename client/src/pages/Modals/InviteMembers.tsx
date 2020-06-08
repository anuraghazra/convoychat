import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import {
  FaTimes,
  FaLink,
  FaPaperPlane,
  FaCopy,
  FaSearch,
} from "react-icons/fa";

import {
  Member as IMember,
  useListUsersQuery,
  useCreateInvitationLinkMutation,
  useInviteMembersMutation,
} from "graphql/generated/graphql";

import MemberSelector from "components/MemberSelector";
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
  const [selectedMembers, setSelectedMembers] = useState<any>({});
  const { state, dispatch } = useModalContext();

  const { register, handleSubmit, errors: formErrors } = useForm<Inputs>();
  const onSubmit = async (data: Inputs) => {};

  const { data: allUsers } = useListUsersQuery();
  const [
    createInvitationLink,
    { data: invitationLink },
  ] = useCreateInvitationLinkMutation({});

  const [inviteMembers, { loading: isLoading }] = useInviteMembersMutation();

  const toggleMemberSelection = (member: IMember) => {
    if (selectedMembers[member.id]) {
      let copy = { ...selectedMembers };
      delete copy[member.id];
      setSelectedMembers({ ...copy });
    } else {
      setSelectedMembers({ ...selectedMembers, [member.id]: member });
    }
  };

  const closeModal = () => {
    dispatch({ type: "CLOSE", modal: "InviteMembers" });
  };

  useEffect(() => {
    if (state.isInviteMembersModalOpen) {
      createInvitationLink({ variables: { roomId } });
    }
  }, [state.isInviteMembersModalOpen, roomId]);

  const selectedMembersIds = Object.keys(selectedMembers);

  return (
    <Modal
      closeTimeoutMS={300}
      isOpen={state.isInviteMembersModalOpen}
      onRequestClose={closeModal}
      contentLabel="Create New Room"
      className="ModalContent"
      overlayClassName="ModalOverlay"
    >
      <h2>Invite Members</h2>
      <small className="textcolor--gray">yeah... yeah spam them</small>

      <Spacer gap="huge" />

      <Input
        type="text"
        icon={FaLink}
        postfixIcon={FaCopy}
        placeholder="invitation link"
        defaultValue={invitationLink?.invitation?.link}
        onPostfixIconClick={e => copyToClipboard(e.value)}
        label={
          <span>
            Copy Invitation Link{" "}
            <span className="textcolor--gray">(expires after 24hours)</span>
          </span>
        }
      />

      <Spacer gap="large" />

      <div>
        <Input
          type="text"
          name="username"
          label="Find Users"
          placeholder="bear grylls"
          icon={FaSearch}
          errors={formErrors}
          inputRef={register({ required: "Username is required" })}
        />

        {allUsers && (
          <MemberSelector
            members={allUsers?.users}
            selectedMembers={selectedMembers}
            onMemberClick={toggleMemberSelection}
          />
        )}

        <Spacer gap="xlarge" />

        <ButtonGroup gap="medium" float="right">
          <Button onClick={closeModal} variant="danger" icon={FaTimes}>
            Cancel
          </Button>
          <Button
            icon={FaPaperPlane}
            isLoading={isLoading}
            disabled={selectedMembersIds.length < 1}
            onClick={() => {
              inviteMembers({
                variables: { roomId, members: selectedMembersIds },
              });
            }}
          >
            Invite members ({selectedMembersIds.length})
          </Button>
        </ButtonGroup>
      </div>
    </Modal>
  );
};

export default React.memo(InviteMembers);
