import React from "react";
import styled from "styled-components";
import { ChromePicker, CirclePicker } from "react-color";
import { FaPalette } from "react-icons/fa";

import { Flex, Dropdown } from "@convoy-ui";

const colors = [
  "#EB4C5F",
  "#4C9FEB",
  "#4CEBA8",
  "#B8EB4C",
  "#F09CFE",
  "#EB984C",
  "#7F4CEB",
  "#EB694C",
  "#FF9D9D",
  "#8AFFDC",
];

const StyledColorPreview = styled.div`
  .color-picker__block {
    display: block;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: ${p => p.theme.radius.small}px;
    height: 100%;
    padding: 15px;
    flex: 1;
  }

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;

  @media (${p => p.theme.media.tablet}) {
    grid-template-columns: 1fr;
  }

  .dropdown__container {
    flex: 1;
  }
  .message__item {
    padding: 0;
  }
`;

interface IColorPreview {
  color: string;
  preview: React.ReactNode;
  handleColorChange: (color: any) => void;
}
const ColorPreview: React.FC<IColorPreview> = ({
  color,
  preview,
  handleColorChange,
}) => {
  return (
    <StyledColorPreview className="color-preview__grid">
      <Flex
        gap="xlarge"
        align="center"
        justify="space-between"
        nowrap
        style={{ flex: 1 }}
      >
        <Dropdown>
          <Dropdown.Toggle>
            <div
              className="color-picker__block"
              style={{ backgroundColor: color }}
            >
              <FaPalette />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Content>
            <ChromePicker color={color} onChange={handleColorChange} />
          </Dropdown.Content>
        </Dropdown>
        <CirclePicker
          width={"150px"}
          circleSize={20}
          circleSpacing={10}
          color={color}
          colors={colors}
          onChange={handleColorChange}
        />
      </Flex>
      <div>{preview}</div>
    </StyledColorPreview>
  );
};

export default ColorPreview;
