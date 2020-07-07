import React from "react";
import styled, { css, CSSProp } from "styled-components/macro";
import { store as notify } from "react-notifications-component";
import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import "react-notifications-component/dist/theme.css";
import theme from "styles/theme";

const ToastTypes: Record<string, CSSProp> = {
  warning: css`
    color: ${theme.colors.redDark};
    background-color: ${theme.colors.red};
  `,
  success: css`
    color: ${theme.colors.greenDark};
    background-color: ${theme.colors.primary};
  `,
  info: css`
    color: ${theme.colors.white};
    background-color: ${theme.colors.gray};
  `,
};

const StyledToastText = styled.div<{ type: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  .notification__icon {
    min-width: 30px;
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

  margin: auto;
  width: max-content;
  padding: 10px 20px;
  border-radius: 5px;

  ${p => ToastTypes[p.type as any]}
`;

export const Toast: React.FC<{
  icon?: any;
  type: string;
}> = ({ icon: Icon, children, type }) => {
  return (
    <StyledToastText type={type}>
      {Icon && <Icon className="notification__icon" />}
      {children}
    </StyledToastText>
  );
};

const defaultConfig = {
  width: 350,
  insert: "bottom",
  container: "bottom-center",
  animationIn: ["animated", "fadeIn"],
  animationOut: ["animated", "fadeOut"],
  dismiss: {
    duration: 50000,
    onScreen: false,
    pauseOnHover: true,
    waitForAnimation: false,
    showIcon: true,
    click: true,
    touch: true,
  },
  slidingEnter: {
    duration: 300,
    timingFunction: "ease-in",
    delay: 0,
  },
  slidingExit: {
    duration: 300,
    timingFunction: "ease-out",
    delay: 0,
  },
};

export const toast = {
  error: (message: string) => {
    notify.addNotification({
      type: "warning",
      content: (
        <Toast type="warning" icon={FaExclamationCircle}>
          {message}
        </Toast>
      ),
      ...(defaultConfig as any),
    });
  },
  success: (message: string) => {
    notify.addNotification({
      type: "success",
      content: (
        <Toast type="success" icon={FaCheckCircle}>
          {message}
        </Toast>
      ),
      ...(defaultConfig as any),
    });
  },
  info: (message: string) => {
    notify.addNotification({
      type: "info",
      content: (
        <Toast type="info" icon={FaInfoCircle}>
          {message}
        </Toast>
      ),
      ...(defaultConfig as any),
    });
  },
};

export default Toast;
