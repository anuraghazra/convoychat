import ReactDOM from "react-dom";
import React from "react";
import Notifications from "react-notifications-component";

export const NotificationsWithPortal = () => {
  return ReactDOM.createPortal(<Notifications />, document.body);
};

export default NotificationsWithPortal;
