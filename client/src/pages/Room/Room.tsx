import React from "react";
import styled from "styled-components";

import { useGetRoomQuery, Member } from "graphql/generated/graphql";
import SidebarWrapper from "components/Sidebar/Sidebar.style";

import { DashboardBody } from "pages/Dashboard/Dashboard.style";
import UserInfoCard from "components/UserInfoCard";
import Message from "components/Message";

const RoomWrapper = styled.div`
  position: absolute;
  bottom: 0;
`;

const Room: React.FC<{ match: any }> = ({ match }) => {
  const { data, error, loading } = useGetRoomQuery({
    variables: {
      roomId: match.params.roomId,
    },
  });

  return (
    <>
      <DashboardBody>
        <h3>/{data?.getRoom?.name}</h3>
        <RoomWrapper>
          <div className="messages">
            {data?.getRoom?.messages?.map(message => {
              return (
                <Message
                  key={message.id}
                  author={message.author as Member}
                  content={message.content}
                />
              );
            })}
          </div>
        </RoomWrapper>
      </DashboardBody>

      <SidebarWrapper>
        <h3>Members</h3>
        <br />
        {data?.getRoom?.members?.map(member => {
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
