import React from "react";
import styled from "styled-components/macro";
import { notify } from "react-notify-toast";
import {
  FaTimes,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const StyledToastText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  .notification__icon {
    margin-right: 10px;
  }
  .close-icon {
    margin-left: 20px;
    transition: 0.2s;
    cursor: pointer;
    &:hover {
      transform: scale(1.2);
      transition: 0.2s;
    }
  }
`;

export const Toast: React.FC<{
  icon?: any;
}> = ({ icon: Icon, children }) => {
  return (
    <StyledToastText>
      {Icon && <Icon className="notification__icon" />}
      {children}
      <FaTimes onClick={notify.hide} className="close-icon" />
    </StyledToastText>
  );
};

export const toast = {
  error: (message: string) => {
    notify.show(<Toast icon={FaExclamationCircle}>{message}</Toast>, "error");
  },
  success: (message: string) => {
    notify.show(<Toast icon={FaCheckCircle}>{message}</Toast>, "success");
  },
  info: (message: string) => {
    notify.show(<Toast icon={FaInfoCircle}>{message}</Toast>, "info");
  },
};

export default Toast;
