import React from "react";
import styled from "styled-components/macro";

interface StyledButtonProps {
  width?: string;
}

interface ButtonProps extends StyledButtonProps {
  icon?: any;
  isLoading?: boolean;
  [x: string]: any;
}

type IStyledButton = StyledButtonProps & React.HTMLAttributes<HTMLDivElement>;

const StyledButton = styled.button<IStyledButton>`
  width: ${p => p.width};
  height: fit-content;
  margin: 10px 0;
  padding: 10px 15px;
  border: none;
  line-height: 1;
  font-size: 14px;
  transition: 0.2s;
  font-family: ${p => p.theme.font.primaryMedium};
  border-radius: ${p => p.theme.radius.small}px;
  background-color: ${p => p.theme.colors.primary};
  color: ${p => p.theme.colors.dark};
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    transition: 0.2s;
  }
  &:disabled {
    opacity: 0.8;
  }
  @media screen and (${p => p.theme.media.mobile}) {
    padding: 10px 25px;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  width,
  icon,
  children,
  type,
  isLoading,
  ...props
}) => (
  <StyledButton {...props} disabled={isLoading} width={width}>
    {icon && "pk"}
    {children}
  </StyledButton>
);

export default Button;
