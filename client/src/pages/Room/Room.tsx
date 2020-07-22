import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import update from "immutability-helper";
import styled from "styled-components";
import Sidebar from "react-sidebar";

import { useGetRoomQuery } from "graphql/generated/graphql";
import { Flex } from "@convoy-ui";
import { scrollToBottom } from "utils";
import { MAX_MESSAGES } from "../../constants";
import { useAuthContext } from "contexts/AuthContext";
import useResponsiveSidebar from "hooks/useResponsiveSidebar";

import RoomHeader from "./RoomHeader";
import SendMessage from "./SendMessage";
import RightSidebar from "./RightSidebar";
import subscribeToMessages from "./subscribeToMessages";
import MessageList from "components/Message/MessageList";
import BidirectionalScroller from "components/BidirectionalScroller";
import { DashboardBody } from "pages/Dashboard/Dashboard.style";

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
  const bodyRef = useRef<HTMLElement>();

  const { isDocked, isOpen, setIsOpen } = useResponsiveSidebar();
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
        window.setTimeout(() => {
          scrollToBottom(bodyRef?.current);
        }, 10);
      }
    },
    variables: {
      roomId: roomId,
      limit: MAX_MESSAGES,
    },
  });

  useEffect(() => {
    subscribeToMessages(
      subscribeToMore,
      { roomId, limit: MAX_MESSAGES },
      user,
      bodyRef
    );
  }, []);

  const fetchPreviousMessages = async () => {
    setIsFetchingMore(true);
    await fetchMore({
      variables: {
        limit: MAX_MESSAGES,
        before: roomData?.messages?.edges[0].cursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        const updatedData = update(prev, {
          messages: {
            pageInfo: { $set: fetchMoreResult.messages?.pageInfo },
            edges: {
              $unshift: fetchMoreResult.messages?.edges,
            },
          },
        });

        setIsFetchingMore(false);
        return updatedData;
      },
    });
  };

  const handleOnReachTop = (restoreScroll: () => void) => {
    if (roomData?.messages?.pageInfo?.hasNext) {
      fetchPreviousMessages().then(restoreScroll);
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
        styles={sidebarStyles}
        sidebar={
          <RightSidebar roomId={roomId} members={roomData?.room?.members} />
        }
      >
        <RoomBody>
          {fetchRoomError && <span>{fetchRoomError?.message}</span>}

          <Flex
            nowrap
            direction="column"
            justify="space-between"
            className="room__body--flex"
          >
            <MessagesWrapper nowrap direction="column">
              <RoomHeader name={roomData?.room?.name} />

              <BidirectionalScroller
                innerRef={bodyRef}
                topLoading={isFetchingMore}
                onReachTop={handleOnReachTop}
              >
                <MessageList
                  isLoading={fetchRoomLoading && !isFetchingMore}
                  messages={roomData?.messages?.edges}
                />
              </BidirectionalScroller>

              <SendMessage
                roomId={roomId}
                bodyRef={bodyRef}
                members={roomData?.room?.members}
              />
            </MessagesWrapper>
          </Flex>
        </RoomBody>
      </Sidebar>
    </>
  );
};

export default Room;
