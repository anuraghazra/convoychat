import update from "immutability-helper";
import { MAX_MESSAGES } from "../../constants";

import {
  GetRoomQuery,
  GetRoomDocument,
  DeleteMessageMutation,
} from "graphql/generated/graphql";
import { MutationUpdaterFn } from "apollo-client";

const deleteMessageMutationUpdater: MutationUpdaterFn<DeleteMessageMutation> = (
  cache,
  { data }
) => {
  let roomId = data.deletedMessage.roomId;
  let room = cache.readQuery<GetRoomQuery>({
    query: GetRoomDocument,
    variables: { roomId, limit: MAX_MESSAGES, offset: 0 },
  });

  cache.writeQuery({
    query: GetRoomDocument,
    variables: { roomId, limit: MAX_MESSAGES, offset: 0 },
    data: update(room, {
      messages: {
        messages: m =>
          m.filter(message => message.id !== data.deletedMessage.id),
      },
    }),
  });
};

export { deleteMessageMutationUpdater };
