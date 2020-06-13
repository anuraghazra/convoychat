import React from "react";
import { Link } from "react-router-dom";

import { timeAgo } from "utils";
import { Flex, Avatar } from "@convoy-ui";

import StyledNotificationItem from "./NotificationItem.style";
import { actionLinks, NotificationSwitch } from "./NotificationSwitch";
import { NotificationDataFragment } from "graphql/generated/graphql";

interface INotificationItem {
  data: NotificationDataFragment;
  onClick: (id: string) => void;
}
const NotificationItem: React.FC<INotificationItem> = ({ data, onClick }) => {
  const actionLink: string = actionLinks[data.type](data.payload);

  return (
    <StyledNotificationItem
      isUnread={data.seen}
      onClick={() => onClick(data.id)}
    >
      <Link to={actionLink}>
        <Flex gap="medium" align="center" nowrap>
          <Avatar size={40} src={data.sender.avatarUrl} />
          <Flex gap="small" direction="column">
            <span className="NotificationItem__time">
              {timeAgo(data.createdAt)}
            </span>
            {NotificationSwitch[data.type](data, data.payload)}
          </Flex>
        </Flex>
      </Link>
    </StyledNotificationItem>
  );
};

export default NotificationItem;
