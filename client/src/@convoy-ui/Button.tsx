import React from "react";
import styled, { css } from "styled-components/macro";
import { VariantTypes } from "./colorVariants";
import Flex from "./Flex";
import { FaSpinner } from "react-icons/fa";

interface StyledButtonProps {
  variant?: VariantTypes;
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
  padding: 10px 30px;
  border: none;
  line-height: 1;
  font-size: 14px;
  font-family: ${p => p.theme.font.primaryMedium};
  border-radius: ${p => p.theme.radius.small}px;

  ${p => (p.theme.variants as any)[p.variant as string]};

  cursor: pointer;
  transition: 0.2s;

  .button__icon {
    margin-bottom: -2px;
    margin-right: ${p => p.theme.space.small}px;
  }

  &:hover {
    transform: scale(1.02);
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
  variant = "primary",
  width,
  icon: Icon,
  children,
  type,
  isLoading,
  ...props
}) => (
  <StyledButton variant={variant} {...props} disabled={isLoading} width={width}>
    {isLoading ? (
      <FaSpinner className="button__icon spin" />
    ) : (
      Icon && <Icon className="button__icon" />
    )}
    <span>{children}</span>
  </StyledButton>
);

export const ButtonGroup = styled(Flex)<{ float?: string }>`
  float: ${p => p.float ?? "none"};
`;

export default Button;
