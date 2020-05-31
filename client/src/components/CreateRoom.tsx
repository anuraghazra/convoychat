import React from "react";
import { useCreateRoomMutation } from "graphql/generated/graphql";
import { FaUsers, FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";

import Modal from "react-modal";
import { Button, ButtonGroup, Spacer, Input } from "@convoy-ui";

Modal.setAppElement("#root");

type Inputs = {
  roomName: string;
};

const CreateRoom: React.FC<{
  isOpen: boolean;
  closeModal: Function;
}> = ({ isOpen, closeModal }) => {
  const [createRoom, { loading }] = useCreateRoomMutation({
    update(store, result) {
      let roomData = result.data.createRoom;
      // const data = store.readQuery({ query: ListRoomsDocument });
      // data.rooms.push(roomData);
      // store.writeQuery({ query: LIST_ROOMS, data });
    },
  });

  const { register, handleSubmit, errors: formErrors } = useForm<Inputs>();
  const onSubmit = (data: Inputs) => {
    createRoom({
      variables: {
        name: data.roomName,
      },
    })
      .then(() => {
        closeModal();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      closeTimeoutMS={300}
      onRequestClose={closeModal}
      className="ModalContent"
      overlayClassName="ModalOverlay"
      contentLabel="Create New Room"
    >
      <h2>Create New Room</h2>
      <small className="textcolor--gray">Give it a cool name</small>
      <Spacer gap="xlarge" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          icon={FaUsers}
          type="text"
          name="roomName"
          placeholder="Anurag's room"
          label="Room Name"
          errors={formErrors}
          inputRef={register({ required: "Room name is required" })}
        />

        <ButtonGroup gap="small" float="right">
          <Button variant="danger" icon={FaTimes}>
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
