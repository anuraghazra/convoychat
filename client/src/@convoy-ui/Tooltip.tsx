import React, { useRef, useEffect, useState } from "react";
import styled, { css, CSSProp } from "styled-components";

type PLACEMENTS =
  | "top"
  | "left"
  | "bottom"
  | "right"
  | "bottom-left"
  | "top-left";

const caret = css`
  position: absolute;
  content: "";
  width: 0;
  height: 0;
`;
const centerV = css`
  top: 50%;
  transform: translateY(-50%);
`;
const centerH = css`
  left: 50%;
  transform: translateX(-50%);
`;

const fourCarets: Record<
  Extract<PLACEMENTS, "top" | "left" | "bottom" | "right">,
  CSSProp
> = {
  top: css`
    ${caret};
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid ${p => p.theme.colors.gray};
    top: 100%;
  `,
  bottom: css`
    ${caret};
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid ${p => p.theme.colors.gray};
    bottom: 100%;
  `,
  left: css`
    ${caret};
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 5px solid ${p => p.theme.colors.gray};
    left: 100%;
  `,
  right: css`
    ${caret};
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-right: 5px solid ${p => p.theme.colors.gray};
    right: 100%;
  `,
};

const carets: Record<PLACEMENTS, CSSProp> = {
  ...fourCarets,
  "bottom-left": css`
    ${caret};
    ${fourCarets.bottom};
  `,
  "top-left": css`
    ${caret};
    ${fourCarets.top};
  `,
};

const placements = {
  top: css`
    bottom: 100%;
    margin-bottom: 5px;
    ${centerH};
    &:before {
      ${carets.top};
      ${centerH};
    }
  `,
  bottom: css`
    top: 100%;
    margin-top: 5px;
    ${centerH};
    &:before {
      ${carets.bottom};
      ${centerH};
    }
  `,
  left: css`
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
    margin-right: 5px;
    ${centerV};
    &:before {
      ${carets.left};
      ${centerV};
    }
  `,
  right: css`
    left: 100%;
    margin-left: 5px;
    ${centerV};
    &:before {
      ${carets.right};
      ${centerV};
    }
  `,
  "bottom-left": css`
    top: 100%;
    margin-top: 5px;
    right: 0;
    &:before {
      ${carets.bottom};
      right: 10px;
    }
  `,
  "top-left": css`
    bottom: 100%;
    margin-bottom: 5px;
    right: 0;
    &:before {
      ${carets.top};
      right: 10px;
    }
  `,
};

const TooltipStyles = styled.div<{ placement: PLACEMENTS }>`
  position: relative;
  width: fit-content;

  .tooltip__trigger:hover + .tooltip__message {
    opacity: 1;
    transition-delay: 0.3s;
  }

  .tooltip__message {
    position: absolute;
    width: fit-content;
    padding: 5px 10px;
    font-size: 12px;
    white-space: pre;
    background-color: ${p => p.theme.colors.dark2};
    border: 1px solid ${p => p.theme.colors.gray};
    border-radius: ${p => p.theme.radius.small}px;
    opacity: 0;
    transition: 0.2s;
    pointer-events: none;
    z-index: 1;

    ${p => (placements as any)[p.placement as any]};
  }
`;

interface ITooltip {
  message: React.ReactNode;
  placement?: PLACEMENTS;
}

export const Tooltip: React.FC<ITooltip> = ({
  children,
  message,
  placement = "top",
}) => {
  const [position, setPosition] = useState<PLACEMENTS>(placement);
  const contentRef = useRef<HTMLDivElement>();
  const calculateBounds = () => {
    if (contentRef.current) {
      const bounds = contentRef.current.getBoundingClientRect();
      if (bounds.left < 5) setPosition("right");
      if (bounds.top < 5) setPosition("bottom");
      if (bounds.right > window.innerWidth) setPosition("left");
      if (bounds.bottom > window.innerHeight) setPosition("top");
    }
  };

  useEffect(() => {
    calculateBounds();
  }, []);

  return (
    <TooltipStyles placement={position}>
      <div className="tooltip__trigger">{children}</div>
      <div className="tooltip__message" ref={contentRef}>
        {message}
      </div>
    </TooltipStyles>
  );
};

export default Tooltip;
