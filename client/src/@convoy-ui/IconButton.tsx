import React from "react";
import styled from "styled-components";
import { FaSpinner } from "react-icons/fa";

const StyledIconButton = styled.button`
  width: 30px;
  min-width: 30px;
  height: 30px;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
  transition: 0.2s;
  font-size: 1em;
  color: ${p => p.theme.colors.white};
  border: none;
  background: none;

  &:hover {
    color: ${p => p.theme.colors.primary};
    transform: scale(1.15);
  }

  @media (${p => p.theme.media.tablet}) {
    svg {
      scale: 1.3;
      font-size: 1.3em;
    }
  }
`;

interface IIconButton {
  icon: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export const IconButton: React.FC<IIconButton> = ({
  icon,
  isLoading,
  onClick,
  disabled,
}) => {
  return (
    <StyledIconButton
      disabled={disabled || isLoading}
      className="icon__button"
      onClick={onClick}
    >
      {isLoading ? <FaSpinner className="spin" /> : icon}
    </StyledIconButton>
  );
};

export default IconButton;
