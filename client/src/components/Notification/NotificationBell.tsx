import React from "react";
import styled from "styled-components";
import { FaBell } from "react-icons/fa";

const StyledNotificationBell = styled.div`
  position: relative;
  padding: 5px;
  cursor: pointer;

  .notification__count {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 25px;
    height: 25px;
    color: white;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
    border-radius: 50px;
    border: 2px solid ${p => p.theme.colors.dark2};
    background-color: ${p => p.theme.colors.red};
  }
`;

const NotificationBell: React.FC<{ count: number }> = ({ count, ...props }) => {
  return (
    <StyledNotificationBell
      aria-label="notification bell"
      role="button"
      {...props}
    >
      <div className="notification__count">{count}</div>
      <FaBell size={18} />
    </StyledNotificationBell>
  );
};

export default NotificationBell;
