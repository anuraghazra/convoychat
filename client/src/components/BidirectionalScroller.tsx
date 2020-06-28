import React, { useRef } from "react";
import styled from "styled-components";
import { Loading } from "@convoy-ui";

const BidirectionalScrollerWrapper = styled.section`
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;

  display: grid;
  grid-template-rows: 1fr;
  align-items: end;
  @media (${p => p.theme.media.tablet}) {
    margin-top: 70px;
  }
`;

interface IBidirectionalScroller {
  onReachTop?: (restoreScroll?: any) => void;
  onReachBottom?: (restoreScroll?: any) => void;
  topLoading?: boolean;
  bottomLoading?: boolean;
  innerRef?: React.MutableRefObject<HTMLElement>;
}

const BidirectionalScroller: React.FC<IBidirectionalScroller> = ({
  children,
  onReachTop,
  onReachBottom,
  topLoading,
  bottomLoading,
  innerRef,
}) => {
  const lastScrollPosition = useRef<number>();
  const wrapperRef = useRef<HTMLDivElement>();

  const handleScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    e.persist();
    const scrollTop = e.currentTarget.scrollTop;
    const scrollHeight = e.currentTarget.scrollHeight;
    const offsetHeight = e.currentTarget.offsetHeight;

    if (scrollTop <= 0 && onReachTop) {
      onReachTop(() => {
        wrapperRef.current.scrollTop = lastScrollPosition.current;
      });
      lastScrollPosition.current = scrollHeight - 75;
    }
    if (scrollHeight - scrollTop === offsetHeight && onReachBottom) {
      onReachBottom(() => {});
    }
  };

  return (
    <BidirectionalScrollerWrapper
      ref={(e: any) => {
        console.log(e);
        wrapperRef.current = e;
        innerRef && (innerRef.current = e);
      }}
      onScrollCapture={handleScroll}
    >
      {topLoading && <Loading />}
      {children}
    </BidirectionalScrollerWrapper>
  );
};

export default BidirectionalScroller;
