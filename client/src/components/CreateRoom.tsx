import React from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { FaUsers, FaTimes } from "react-icons/fa";
import {
  useCreateRoomMutation,
  ListCurrentUserRoomsDocument,
} from "graphql/generated/graphql";

import { Button, ButtonGroup, Spacer, Input } from "@convoy-ui";

type Inputs = {
  roomName: string;
};

interface ICreateRoom {
  isOpen: boolean;
  closeModal: Function;
}
const CreateRoom: React.FC<ICreateRoom> = ({ isOpen, closeModal }) => {
  const { register, handleSubmit, errors: formErrors } = useForm<Inputs>();

  const [createRoom, { loading }] = useCreateRoomMutation({
    refetchQueries: [{ query: ListCurrentUserRoomsDocument }],
  });

  const onSubmit = async (data: Inputs) => {
    try {
      await createRoom({
        variables: {
          name: data.roomName,
        },
      });
      closeModal();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      closeTimeoutMS={300}
      onRequestClose={closeModal}
      contentLabel="Create New Room"
      className="ModalContent"
      overlayClassName="ModalOverlay"
    >
      <h2>Create New Room</h2>
      <small className="textcolor--gray">Give it a cool name</small>
      <Spacer gap="xlarge" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          name="roomName"
          label="Room Name"
          placeholder="Anurag's room"
          icon={FaUsers}
          errors={formErrors}
          inputRef={register({ required: "Room name is required" })}
        />

        <ButtonGroup gap="medium" float="right">
          <Button onClick={closeModal} variant="danger" icon={FaTimes}>
            Cancel
          </Button>
          <Button isLoading={loading} icon={FaUsers}>
            Create room
          </Button>
        </ButtonGroup>
      </form>
    </Modal>
  );
};

export default CreateRoom;
