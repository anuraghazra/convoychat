import React, { useState, useRef, useEffect } from "react";
import update from "immutability-helper";
import styled from "styled-components";
import { v4 } from "uuid";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useGetRoomQuery,
  useSendMessageMutation,
  GetRoomDocument,
  Message as IMessage,
  OnNewMessageDocument,
  OnDeleteMessageDocument,
  OnUpdateMessageDocument,
  GetRoomQuery,
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
import { MAX_MESSAGES } from "../../constants";

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

  const {
    data: roomData,
    error: fetchRoomError,
    loading: fetchRoomLoading,
    subscribeToMore,
    fetchMore,
  } = useGetRoomQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted(data) {
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

  const [sendMessage, { error: sendError }] = useSendMessageMutation({
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
      try {
        let roomId = data.sendMessage.roomId;
        let room = cache.readQuery<GetRoomQuery>({
          query: GetRoomDocument,
          variables: { roomId, limit: MAX_MESSAGES, offset: 0 },
        });

        cache.writeQuery({
          query: GetRoomDocument,
          variables: { roomId, limit: MAX_MESSAGES, offset: 0 },
          data: update(room, {
            messages: { messages: { $push: [data.sendMessage] } },
          }),
        });
      } catch (err) {
        console.log(err);
      }
    },
  });

  useEffect(() => {
    // new message subscription
    subscribeToMore({
      variables: {
        roomId,
        limit: MAX_MESSAGES,
        offset: roomData?.messages?.messages?.length,
      },
      document: OnNewMessageDocument,
      updateQuery: (prev, data: any) => {
        const newData = data.subscriptionData;
        const newMessage: IMessage = newData.data.onNewMessage;
        if (!newMessage || newMessage.author.id === user.id) return prev;

        window.setTimeout(() => {
          scrollToBottom(bodyRef?.current);
        }, 50);

        return update(prev, {
          messages: { messages: { $push: [newMessage] } },
        });
      },
    });

    // deleteMessage subscription
    subscribeToMore({
      variables: {
        roomId,
        limit: MAX_MESSAGES,
        offset: roomData?.messages?.messages?.length,
      },
      document: OnDeleteMessageDocument,
      updateQuery: (prev, data: any) => {
        const newData = data.subscriptionData;
        const deletedMessage: IMessage = newData.data.onDeleteMessage;
        if (!deletedMessage || deletedMessage.author.id === user.id) {
          return prev;
        }

        return update(prev, {
          messages: {
            messages: m => m.filter(m => m.id !== deletedMessage.id),
          },
        });
      },
    });

    // update message subscription
    subscribeToMore({
      variables: {
        roomId,
        limit: MAX_MESSAGES,
        offset: roomData?.messages?.messages?.length,
      },
      document: OnUpdateMessageDocument,
    });
  }, []);

  const onMessageSubmit = (data: IInputs) => {
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
    if (e.nativeEvent.target.scrollTop === 0) {
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
          <DashboardHeader>
            <h3>/{roomData?.room?.name}</h3>
          </DashboardHeader>

          <MessagesWrapper>
            {fetchRoomLoading && <Loading />}
            {sendError && <span>Error sending message</span>}
            <MessageList
              messages={roomData?.messages?.messages as IMessage[]}
            />
            <Spacer gap="large" />
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
        <br />
        {roomData?.room?.members?.map(member => {
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
