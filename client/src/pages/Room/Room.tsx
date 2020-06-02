import React, { useRef } from "react";
import styled from "styled-components";
import { v4 } from "uuid";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  Message as IMessage,
  GetRoomDocument,
  useGetRoomQuery,
  useSendMessageMutation,
} from "graphql/generated/graphql";

import {
  DashboardBody,
  DashboardHeader,
} from "pages/Dashboard/Dashboard.style";

import Loading from "components/Loading";
import UserInfoCard from "components/UserInfoCard";
import SidebarWrapper from "components/Sidebar/Sidebar.style";
import MessageList from "components/MessageList";
import MessageInput from "components/MessageInput";

import { Flex, Spacer } from "@convoy-ui";
import { scrollToBottom } from "utils";
import { useAuthContext } from "contexts/AuthContext";

const MessagesWrapper = styled.div`
  width: 100%;
`;

interface IInputs {
  message: string;
}

const Room: React.FC = () => {
  const { user } = useAuthContext();
  const { roomId } = useParams();
  const bodyRef = useRef<HTMLElement | null>();
  // prettier-ignore
  const { 
    getValues,
    setValue,
    register,
    handleSubmit,
    errors: formErrors,
  } = useForm<IInputs>();

  const [
    sendMessage,
    { loading: sending, error: sendError },
  ] = useSendMessageMutation({
    optimisticResponse: {
      __typename: "Mutation",
      sendMessage: {
        __typename: "Message",
        id: v4(),
        roomId,
        content: getValues().message,
        createdAt: `${Date.now()}`,
        author: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatarUrl: user.avatarUrl,
          __typename: "Member",
        },
      },
    },
    update(cache, { data }) {
      let roomId = data.sendMessage.roomId;
      const { getRoom } = cache.readQuery({
        query: GetRoomDocument,
        variables: { roomId },
      });

      cache.writeQuery({
        query: GetRoomDocument,
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
    onCompleted() {
      scrollToBottom(bodyRef?.current);
    },
    variables: {
      roomId: roomId,
    },
  });

  const onSubmit = (data: IInputs) => {
    sendMessage({
      variables: { content: data.message, roomId: roomId },
    });
    setValue("message", "");
    // delaying because instantly scrolling to bottom does
    // not register the height
    window.setTimeout(() => {
      scrollToBottom(bodyRef?.current);
    }, 50);
  };

  return (
    <>
      <DashboardBody ref={bodyRef}>
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
            <MessageList messages={rooms?.getRoom?.messages as IMessage[]} />
            <Spacer gap="large" />
            <MessageInput
              name="message"
              errors={formErrors}
              onSubmit={handleSubmit(onSubmit)}
              onEmojiClick={emoji => {
                setValue("message", getValues().message + emoji.native);
              }}
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
