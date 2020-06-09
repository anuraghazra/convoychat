import React from "react";
import { Notification as INotification } from "graphql/generated/graphql";

export const types = {
  INVITATION: "INVITATION",
  MENTION: "MENTION",
};

export const actionLinks = {
  [types.INVITATION]: (payload: any) => {
    return `/invitation/${payload.token}`;
  },
  [types.MENTION]: (payload: any) => {
    return `/roomId/${payload.roomId}/#${payload.messageId}`;
  },
};

export const NotificationSwitch = {
  [types.INVITATION]: (notification: INotification, payload: any) => {
    return (
      <span>
        <span className="textcolor--primary">{notification.sender.name}</span>{" "}
        invited you to join "
        <span className="textcolor--primary">{payload.roomName}</span>"
      </span>
    );
  },
  [types.MENTION]: (notification: INotification, payload: any) => {
    return (
      <span>
        <span className="textcolor--primary">{notification.sender.name}</span>{" "}
        mentioned you in a comment at "
        <span className="textcolor--primary">{payload.roomName}</span>"
        <span className="textcolor--gray">{payload.message}</span>
      </span>
    );
  },
};
