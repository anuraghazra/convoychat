import React from "react";
import styled from "styled-components";

const StyledIconButton = styled.div`
  width: 30px;
  height: 30px;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
  transition: 0.2s;

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
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
export const IconButton: React.FC<IIconButton> = ({ icon, onClick }) => {
  return (
    <StyledIconButton className="icon__button" onClick={onClick}>
      {icon}
    </StyledIconButton>
  );
};

export default IconButton;
