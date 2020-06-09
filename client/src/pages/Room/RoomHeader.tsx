import React, { useRef, useEffect } from "react";
import update from "immutability-helper";
import styled from "styled-components";

import {
  useGetNotificationsQuery,
  OnNewNotificationDocument,
  useReadNotificationMutation,
} from "graphql/generated/graphql";
import { Flex, Dropdown, Spacer, Loading } from "@convoy-ui";

import { DashboardHeader } from "pages/Dashboard/Dashboard.style";
import NotificationItem from "components/Notification/NotificationItem";
import NotificationBell from "components/Notification/NotificationBell";

const StyledRoomHeader = styled.div`
  .dropdown--content {
    width: 350px;
    height: 400px;
    overflow: scroll;
    padding: 20px 30px;
    background-color: ${p => p.theme.colors.dark1};
  }
`;

interface IRoomHeader {
  roomId: string;
  name: string;
}
const RoomHeader: React.FC<IRoomHeader> = ({ roomId, name }) => {
  const unreadNotificationCount = useRef<number>(0);
  const { data, loading, subscribeToMore } = useGetNotificationsQuery();
  const [readNotification] = useReadNotificationMutation({
    onError() {},
  });

  useEffect(() => {
    subscribeToMore({
      document: OnNewNotificationDocument,
      updateQuery: (prev, data: any): any => {
        if (!data.subscriptionData) return prev;
        return update(prev, {
          notifications: {
            $unshift: [data.subscriptionData.data.onNewNotification],
          },
        });
      },
    });
  }, []);

  const calculateNewNotificationCount = () => {
    return data?.notifications.reduce(
      (prev, curr) => (curr.seen === false ? prev + 1 : 0),
      0
    );
  };
  unreadNotificationCount.current = calculateNewNotificationCount();

  return (
    <DashboardHeader>
      <StyledRoomHeader>
        <Flex align="center" justify="space-between" nowrap>
          <h3>{name}</h3>

          <Dropdown>
            <Dropdown.Toggle>
              <NotificationBell count={unreadNotificationCount.current} />
            </Dropdown.Toggle>
            <Dropdown.Content>
              <Flex align="center" justify="space-between" nowrap>
                <h3>Notifications</h3>
                <small className="textcolor--gray">Mark all as read</small>
              </Flex>
              <Spacer gap="xlarge" />
              {loading ? (
                <Loading />
              ) : (
                <section>
                  {data?.notifications?.map(noti => (
                    <NotificationItem
                      key={noti.id}
                      data={noti}
                      onClick={id => readNotification({ variables: { id } })}
                    />
                  ))}
                </section>
              )}
            </Dropdown.Content>
          </Dropdown>
        </Flex>
      </StyledRoomHeader>
    </DashboardHeader>
  );
};

export default RoomHeader;
