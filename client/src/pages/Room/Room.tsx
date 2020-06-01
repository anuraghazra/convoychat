import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useGetRoomQuery,
  useSendMessageMutation,
} from "graphql/generated/graphql";
import { GET_ROOM } from "graphql/tyepDefs";

import { Flex, Spacer } from "@convoy-ui";
import Loading from "components/Loading";

import UserInfoCard from "components/UserInfoCard";
import SidebarWrapper from "components/Sidebar/Sidebar.style";
import {
  DashboardBody,
  DashboardHeader,
} from "pages/Dashboard/Dashboard.style";

import MessageList from "components/MessageList";
import MessageInput from "components/MessageInput";

const MessagesWrapper = styled.div`
  width: 100%;
`;

interface IInputs {
  message: string;
}

const Room: React.FC = () => {
  const { roomId } = useParams();
  // prettier-ignore
  const { 
    setValue,
    register,
    handleSubmit,
    errors: formErrors,
  } = useForm<IInputs>();

  const [
    sendMessage,
    { loading: sending, error: sendError },
  ] = useSendMessageMutation({
    onCompleted() {
      setValue("message", "");
    },
    update(cache, { data }) {
      let roomId = data.sendMessage.roomId;
      const { getRoom } = cache.readQuery({
        query: GET_ROOM,
        variables: { roomId },
      });

      cache.writeQuery({
        query: GET_ROOM,
        variables: { roomId },
        data: {
          getRoom: {
            ...getRoom,
            messages: [...getRoom.messages, data.sendMessage],
          },
        },
      });
    },
  });

  const {
    data: rooms,
    error: fetchRoomError,
    loading: fetchRoomLoading,
  } = useGetRoomQuery({
    variables: {
      roomId: roomId,
    },
  });

  const onSubmit = (data: IInputs) => {
    console.log(data)
    sendMessage({
      variables: { content: data.message, roomId: roomId },
    });
  };

  return (
    <>
      <DashboardBody>
        {fetchRoomError && <span>Error loading room</span>}
        <Flex
          nowrap
          style={{ height: "100%" }}
          direction="column"
          justify="space-between"
        >
          <DashboardHeader>
            <h3>/{rooms?.getRoom?.name}</h3>
          </DashboardHeader>

          <MessagesWrapper>
            {fetchRoomLoading && <Loading />}
            {sendError && <span>Error sending message</span>}
            <MessageList messages={rooms?.getRoom?.messages} />
            <Spacer gap="large" />
            <MessageInput
              name="message"
              errors={formErrors}
              onSubmit={handleSubmit(onSubmit)}
              inputRef={register({ required: "Message is required" })}
            />
          </MessagesWrapper>
        </Flex>
      </DashboardBody>

      <SidebarWrapper>
        <h3>Members</h3>
        <br />
        {rooms?.getRoom?.members?.map(member => {
          return (
            <UserInfoCard
              isMember
              key={member.id}
              name={member.name}
              image={member.avatarUrl}
              username={member.username}
            />
          );
        })}
      </SidebarWrapper>
    </>
  );
};

export default Room;
