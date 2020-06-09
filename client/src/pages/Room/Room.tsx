import React, { useEffect, useRef, useState } from "react";
import {
  Member,
  useGetRoomQuery,
  Message as IMessage,
  useSendMessageMutation,
} from "graphql/generated/graphql";

import styled from "styled-components";
import update from "immutability-helper";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import RoomHeader from "./RoomHeader";
import MemberList from "components/Member/MemberList";
import MessageList from "components/Message/MessageList";
import MessageInput from "components/Message/MessageInput";
import SidebarWrapper from "components/Sidebar/Sidebar.style";
import { DashboardBody } from "pages/Dashboard/Dashboard.style";
import subscribeToMessages from "./subscribeToMessages";

import { scrollToBottom } from "utils";
import { MAX_MESSAGES } from "../../constants";
import { Flex, Spacer, Loading } from "@convoy-ui";
import { useAuthContext } from "contexts/AuthContext";

import {
  updateCacheAfterSendMessage,
  sendMessageOptimisticResponse,
} from "./Room.helpers";

const MessagesWrapper = styled.div`
  width: 100%;
`;

interface IInputs {
  message: string;
}

const Room: React.FC = () => {
  const { user } = useAuthContext();
  const { roomId } = useParams();
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const bodyRef = useRef<HTMLElement | null>();

  const {
    getValues,
    setValue,
    register,
    handleSubmit,
    errors: formErrors,
  } = useForm<IInputs>();

  // fetch room query
  const {
    fetchMore,
    subscribeToMore,
    data: roomData,
    error: fetchRoomError,
    loading: fetchRoomLoading,
  } = useGetRoomQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted() {
      if (!isFetchingMore) {
        scrollToBottom(bodyRef?.current);
      }
    },
    variables: {
      roomId: roomId,
      offset: 0,
      limit: MAX_MESSAGES,
    },
  });

  // send message mutation
  const [sendMessage, { error: sendError }] = useSendMessageMutation({
    optimisticResponse: sendMessageOptimisticResponse(
      roomId,
      getValues().message,
      user
    ),
    update: updateCacheAfterSendMessage,
  });

  // submit message
  const onMessageSubmit = (data: IInputs) => {
    sendMessage({
      variables: {
        content: data.message,
        roomId: roomId,
      },
    });
    setValue("message", "");
    window.setTimeout(() => {
      scrollToBottom(bodyRef?.current);
    }, 50);
  };

  useEffect(() => {
    subscribeToMessages(
      subscribeToMore,
      { roomId, limit: MAX_MESSAGES, offset: 0 },
      user,
      bodyRef
    );
  }, []);

  const fetchMoreMessages = () => {
    setIsFetchingMore(true);
    fetchMore({
      variables: {
        limit: MAX_MESSAGES,
        offset: roomData?.messages?.messages?.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return update(prev, {
          messages: {
            messages: {
              $unshift: fetchMoreResult.messages?.messages,
            },
          },
        });
      },
    });
  };

  const handleScroll = (e: any) => {
    e.persist();
    if (bodyRef.current.scrollTop === 0) {
      fetchMoreMessages();
    }
  };

  return (
    <>
      <DashboardBody onScrollCapture={handleScroll} ref={bodyRef}>
        {fetchRoomError && <span>{fetchRoomError?.message}</span>}
        <Flex
          nowrap
          style={{ height: "100%" }}
          direction="column"
          justify="space-between"
        >
          <RoomHeader name={roomData?.room?.name} roomId={roomData?.room?.id} />

          {fetchRoomLoading && <Loading />}
          {sendError && <span>Error sending message</span>}
          <MessagesWrapper>
            <MessageList
              messages={roomData?.messages?.messages as IMessage[]}
            />

            <MessageInput
              name="message"
              errors={formErrors}
              onSubmit={handleSubmit(onMessageSubmit)}
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
        <Spacer gap="large" />
        <MemberList
          roomId={roomId}
          members={roomData?.room?.members as Member[]}
        />
      </SidebarWrapper>
    </>
  );
};

export default Room;
