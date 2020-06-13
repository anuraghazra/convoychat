import React from "react";
import { Spacer } from "@convoy-ui";
import MemberList from "components/Member/MemberList";
import SidebarWrapper from "components/Sidebar/Sidebar.style";
import { RoomMemberFragment } from "graphql/generated/graphql";

interface IRightSidebar {
  roomId: string;
  members: RoomMemberFragment[];
}
const RightSidebar: React.FC<IRightSidebar> = ({ roomId, members }) => (
  <SidebarWrapper>
    <h3>Members</h3>
    <Spacer gap="large" />
    <MemberList roomId={roomId} members={members} />
  </SidebarWrapper>
);

export default React.memo(RightSidebar);
