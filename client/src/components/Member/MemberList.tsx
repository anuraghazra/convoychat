import React from "react";
import update from "immutability-helper";

import {
  GetRoomQuery,
  GetRoomDocument,
  Member as IMember,
  useRemoveMemberMutation,
} from "graphql/generated/graphql";

import Member from "./Member";
import { MAX_MESSAGES } from "../../constants";

interface IMemberList {
  members?: IMember[];
  roomId?: string;
}

const MemberList: React.FC<IMemberList> = ({ members, roomId }) => {
  const [removeMember] = useRemoveMemberMutation({
    onError(err) {
      console.log(err);
    },
    update(cache, { data }) {
      let roomData = cache.readQuery<GetRoomQuery>({
        query: GetRoomDocument,
        variables: { roomId, limit: MAX_MESSAGES, offset: 0 },
      });

      cache.writeQuery<GetRoomQuery>({
        query: GetRoomDocument,
        variables: { roomId, limit: MAX_MESSAGES, offset: 0 },
        data: update(roomData, {
          room: {
            members: m => m.filter(m => m.id !== data.removedMember.id),
          },
        }),
      });
    },
  });

  const handleRemoveMember = (member: IMember) => {
    removeMember({
      optimisticResponse: {
        __typename: "Mutation",
        removedMember: member,
      },
      variables: {
        roomId: roomId,
        memberId: member.id,
      },
    });
  };

  return (
    <>
      {members?.map(member => (
        <Member
          key={member.id}
          user={member}
          onActionClick={handleRemoveMember}
        />
      ))}
    </>
  );
};

export default MemberList;
