import update from "immutability-helper";
import { v4 } from "uuid";
import { MAX_MESSAGES } from "../../constants";
import { MutationUpdaterFn } from "apollo-client";
import {
  Me,
  Message as IMessage,
  GetRoomQuery,
  GetRoomDocument,
  SendMessageMutation,
} from "graphql/generated/graphql";

const sendMessageOptimisticResponse = (
  roomId: string,
  content: string,
  user: Me
): SendMessageMutation => {
  return {
    __typename: "Mutation",
    sendMessage: {
      __typename: "Message",
      id: v4(),
      roomId,
      content: content,
      mentions: [],
      createdAt: Date.now(),
      author: {
        color: user.color,
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        __typename: "Member",
      },
    },
  };
};

const updateCacheAfterSendMessage: MutationUpdaterFn<SendMessageMutation> = (
  cache,
  { data }
) => {
  try {
    let roomId = data.sendMessage.roomId;
    let room = cache.readQuery<GetRoomQuery>({
      query: GetRoomDocument,
      variables: { roomId, limit: MAX_MESSAGES },
    });

    cache.writeQuery({
      query: GetRoomDocument,
      variables: { roomId, limit: MAX_MESSAGES },
      data: update(room, {
        messages: {
          edges: {
            $push: [
              {
                __typename: "MessageEdge",
                cursor: btoa(data.sendMessage.id),
                node: data.sendMessage as IMessage,
              },
            ],
          },
        },
      }),
    });
  } catch (err) {
    console.log(err);
  }
};

export { sendMessageOptimisticResponse, updateCacheAfterSendMessage };
