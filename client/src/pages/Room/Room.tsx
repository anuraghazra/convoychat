import React, { useEffect, useRef, useState } from "react";
import {
  Member,
  useGetRoomQuery,
  Message as IMessage,
  useSendMessageMutation,
} from "graphql/generated/graphql";

import Sidebar from "react-sidebar";
import styled from "styled-components";
import update from "immutability-helper";
import { useParams } from "react-router-dom";

import RoomHeader from "./RoomHeader";
import MemberList from "components/Member/MemberList";
import MessageList from "components/Message/MessageList";
import MessageInput from "components/MessageInput/MessageInput";
import { useMessageInput } from "components/MessageInput/MessageInput";
import { DashboardBody } from "pages/Dashboard/Dashboard.style";
import SidebarWrapper from "components/Sidebar/Sidebar.style";
import subscribeToMessages from "./subscribeToMessages";

import { scrollToBottom } from "utils";
import { MAX_MESSAGES } from "../../constants";
import { Flex, Spacer } from "@convoy-ui";
import { useAuthContext } from "contexts/AuthContext";

import {
  updateCacheAfterSendMessage,
  sendMessageOptimisticResponse,
} from "./Room.helpers";
import useResponsiveSidebar from "hooks/useResponsiveSidebar";

const MessagesWrapper = styled(Flex)`
  width: 100%;
  height: var(--app-height);
`;

const Room: React.FC = () => {
  const { user } = useAuthContext();
  const { roomId } = useParams();

  const bodyRef = useRef<HTMLElement | null>();
  const { isDocked, isOpen, setIsOpen } = useResponsiveSidebar();
  const { value, setValue, handleChange, handleEmojiClick } = useMessageInput();
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);

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
    optimisticResponse: sendMessageOptimisticResponse(roomId, value, user),
    onError(err) {
      console.log(err);
    },
    update: updateCacheAfterSendMessage,
  });

  // submit message
  const onMessageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    sendMessage({
      variables: {
        content: (event.target as any).message.value,
        roomId: roomId,
      },
    });
    setValue("");
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
        const updatedData = update(prev, {
          messages: {
            messages: {
              $unshift: fetchMoreResult.messages?.messages,
            },
          },
        });

        // scroll jumping fix
        const lastMessage: any = bodyRef.current.getElementsByClassName(
          "message__item"
        )[0];
        const bounds = lastMessage.getBoundingClientRect();
        bodyRef.current.scrollTop = bounds.top - 60;

        return updatedData;
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
      <Sidebar
        touch
        pullRight
        open={isOpen}
        docked={isDocked}
        onSetOpen={setIsOpen}
        styles={{
          sidebar: {
            width: "300px",
            overflow: "visible",
          },
        }}
        sidebar={
          <SidebarWrapper>
            <h3>Members</h3>
            <Spacer gap="large" />
            <MemberList
              roomId={roomId}
              members={roomData?.room?.members as Member[]}
            />
          </SidebarWrapper>
        }
      >
        <DashboardBody>
          {sendError && <span>{sendError?.message}</span>}
          {fetchRoomError && <span>{fetchRoomError?.message}</span>}

          <Flex
            nowrap
            direction="column"
            justify="space-between"
            style={{ minHeight: "100%" }}
          >
            <MessagesWrapper nowrap direction="column">
              <RoomHeader
                name={roomData?.room?.name}
                roomId={roomData?.room?.id}
              />

              <MessageList
                ref={bodyRef as any}
                onScroll={handleScroll}
                isFetchingMore={fetchRoomLoading}
                messages={roomData?.messages?.messages as IMessage[]}
              />

              <MessageInput
                value={value}
                handleChange={handleChange}
                onSubmit={onMessageSubmit}
                onEmojiClick={handleEmojiClick}
                mentionSuggestions={roomData?.room?.members}
              />
            </MessagesWrapper>
          </Flex>
        </DashboardBody>
      </Sidebar>
    </>
  );
};

export default Room;
