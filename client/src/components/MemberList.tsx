import React, { useState } from "react";
import update from "immutability-helper";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import {
  GetRoomQuery,
  GetRoomDocument,
  Member as IMember,
  useRemoveMemberMutation,
} from "graphql/generated/graphql";

import Member from "./Member";
import { Avatar, Flex, Button } from "@convoy-ui";
import { FaUserMinus } from "react-icons/fa";
import { MAX_MESSAGES } from "../constants";

const MEMBER_CONTEXTMENU_ID = "member_context_menu_item";

interface IMemberList {
  members?: IMember[];
  roomId?: string;
}

const MemberList: React.FC<IMemberList> = ({ members, roomId }) => {
  const [selectedMember, setSelectedMember] = useState<IMember | null>(null);
  const [removeMember] = useRemoveMemberMutation({
    optimisticResponse: {
      __typename: "Mutation",
      removedMember: selectedMember,
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

  return (
    <>
      <ContextMenu id={MEMBER_CONTEXTMENU_ID}>
        <Flex gap="medium" direction="column">
          <MenuItem
            onClick={() => {
              removeMember({
                variables: {
                  roomId: roomId,
                  memberId: selectedMember.id,
                },
              });
            }}
          >
            <Button icon={FaUserMinus} variant="danger">
              Remove Member
            </Button>
          </MenuItem>
          <MenuItem onClick={() => {}}>
            <Button icon={FaUserMinus} variant="primary">
              Remove Member
            </Button>
          </MenuItem>
        </Flex>
      </ContextMenu>

      {members?.map(member => (
        <ContextMenuTrigger
          key={member.id}
          holdToDisplay={1000}
          id={MEMBER_CONTEXTMENU_ID}
        >
          <Member
            user={member}
            onRightClick={member => setSelectedMember(member)}
          />
        </ContextMenuTrigger>
      ))}
    </>
  );
};

export default MemberList;
