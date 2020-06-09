import styled, { css } from "styled-components";

const StyledNotificationItem = styled.div<{ isUnread?: boolean }>`
  padding: 15px 30px;
  margin-left: -30px;
  margin-right: -30px;
  margin-top: 5px;

  background-color: ${p => p.theme.colors.dark2};
  ${p =>
    p.isUnread &&
    css`
      background-color: ${p => p.theme.colors.dark3};
    `}

  a,
  span {
    font-size: 14px;
  }
  .NotificationItem__time {
    font-size: 12px;
    color: ${p => p.theme.colors.gray};
  }
`;

export default StyledNotificationItem;
