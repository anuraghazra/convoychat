import React, { useState, useEffect } from "react";
import update from "immutability-helper";

import {
  useGetNotificationsQuery,
  OnNewNotificationDocument,
  useReadNotificationMutation,
} from "graphql/generated/graphql";

import { Flex, Dropdown, Loading } from "@convoy-ui";
import NotificationItem from "components/Notification/NotificationItem";
import NotificationBell from "components/Notification/NotificationBell";

const NotificationDropdown = () => {
  const [unreadNotificationCount, setUnreadNotificationCount] = useState<
    number
  >(0);
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
    return data?.notifications?.reduce(
      (prev, curr) => (curr?.seen === false ? prev + 1 : prev),
      0
    );
  };

  useEffect(() => {
    let count = calculateNewNotificationCount() || 0;
    setUnreadNotificationCount(count);
  }, [data]);

  return (
    <Dropdown>
      <Dropdown.Toggle>
        <NotificationBell count={unreadNotificationCount} />
      </Dropdown.Toggle>
      <Dropdown.Content className="notification___dropdown">
        <Flex
          className="notification__header"
          align="center"
          justify="space-between"
          nowrap
        >
          <h3>Notifications</h3>
          <small className="textcolor--gray">Mark all as read</small>
        </Flex>
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
  );
};

export default NotificationDropdown;
