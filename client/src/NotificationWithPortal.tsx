import ReactDOM from "react-dom";
import React from "react";
import theme from "styles/theme";
import Notifications from "react-notify-toast";

export const NotificationsWithPortal = () => {
  return ReactDOM.createPortal(
    <Notifications
      options={{
        zIndex: 200,
        top: "85%",
        colors: {
          error: {
            color: theme.colors.redDark,
            backgroundColor: theme.colors.red,
          },
          success: {
            color: theme.colors.greenDark,
            backgroundColor: theme.colors.primary,
          },
          info: {
            color: theme.colors.white,
            backgroundColor: theme.colors.gray,
          },
        },
      }}
    />,
    document.body
  );
};

export default NotificationsWithPortal;
