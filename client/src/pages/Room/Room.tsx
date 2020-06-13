import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  useGetRoomQuery,
  Message as IMessage,
  useSendMessageMutation,
} from "graphql/generated/graphql";

import Sidebar from "react-sidebar";
import styled from "styled-components";
import update from "immutability-helper";
import { useParams } from "react-router-dom";

import RoomHeader from "./RoomHeader";
import MessageList from "components/Message/MessageList";
import MessageInput from "components/MessageInput/MessageInput";
import useMessageInput from "components/MessageInput/useMessageInput";
import { DashboardBody } from "pages/Dashboard/Dashboard.style";
import subscribeToMessages from "./subscribeToMessages";

import { Flex } from "@convoy-ui";
import { scrollToBottom } from "utils";
import { MAX_MESSAGES } from "../../constants";
import { useAuthContext } from "contexts/AuthContext";

import {
  updateCacheAfterSendMessage,
  sendMessageOptimisticResponse,
} from "./Room.helpers";
import RightSidebar from "./RightSidebar";
import useResponsiveSidebar from "hooks/useResponsiveSidebar";

const MessagesWrapper = styled(Flex)`
  width: 100%;
  height: var(--app-height);
`;
const RoomBody = styled(DashboardBody)`
  .room__body--flex {
    min-height: 100%;
  }
`;
const sidebarStyles = {
  sidebar: {
    width: "300px",
    overflow: "visible",
  },
};

const Room: React.FC = () => {
  const { user } = useAuthContext();
  const { roomId } = useParams();

  const bodyRef = useRef<HTMLElement | null>();
  const { isDocked, isOpen, setIsOpen } = useResponsiveSidebar();
  const {
    value,
    setValue,
    mentions,
    textareaRef,
    handleChange,
    handleEmojiClick,
  } = useMessageInput();
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
    optimisticResponse: sendMessageOptimisticResponse(
      roomId,
      value,
      user,
      mentions.map(m => m.id)
    ),
    onError(err) {
      console.log(err);
    },
    update: updateCacheAfterSendMessage,
  });

  // submit message
  const onMessageSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      sendMessage({
        variables: {
          content: (event.target as any).message.value,
          mentions: mentions.map(m => m.id),
          roomId: roomId,
        },
      });
      setValue("");
      window.setTimeout(() => {
        scrollToBottom(bodyRef?.current);
      }, 50);
    },
    [mentions]
  );

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

  const handleScroll = useCallback(
    (e: any) => {
      e.persist();
      if (bodyRef.current.scrollTop === 0) {
        fetchMoreMessages();
      }
    },
    [roomData?.messages?.messages?.length]
  );

  return (
    <>
      <Sidebar
        touch
        pullRight
        open={isOpen}
        docked={isDocked}
        onSetOpen={setIsOpen}
        styles={sidebarStyles}
        sidebar={
          <RightSidebar roomId={roomId} members={roomData?.room?.members} />
        }
      >
        <RoomBody>
          {sendError && <span>{sendError?.message}</span>}
          {fetchRoomError && <span>{fetchRoomError?.message}</span>}

          <Flex
            nowrap
            direction="column"
            justify="space-between"
            className="room__body--flex"
          >
            <MessagesWrapper nowrap direction="column">
              <RoomHeader name={roomData?.room?.name} />

              <MessageList
                ref={bodyRef as any}
                onScroll={handleScroll}
                isFetchingMore={fetchRoomLoading}
                messages={roomData?.messages?.messages as IMessage[]}
              />

              <MessageInput
                value={value}
                innerRef={textareaRef}
                handleSubmit={onMessageSubmit}
                handleChange={handleChange}
                onEmojiClick={handleEmojiClick}
                mentionSuggestions={roomData?.room?.members}
              />
            </MessagesWrapper>
          </Flex>
        </RoomBody>
      </Sidebar>
    </>
  );
};

export default Room;
