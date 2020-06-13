import React from "react";

import { Flex } from "@convoy-ui";
import { DashboardHeader } from "pages/Dashboard/Dashboard.style";
import NotificationDropdown from "components/Notification/NotificationDropdown";

interface IRoomHeader {
  name: string;
}
const RoomHeader: React.FC<IRoomHeader> = ({ name }) => {
  return (
    <DashboardHeader>
      <div>
        <Flex align="center" justify="space-between" nowrap>
          <h3>{name}</h3>
          <NotificationDropdown />
        </Flex>
      </div>
    </DashboardHeader>
  );
};

export default RoomHeader;
