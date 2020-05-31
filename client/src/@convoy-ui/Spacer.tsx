import styled from "styled-components";
import { IGaps } from "@convoy-ui";

export const Spacer = styled.div<{ gap: IGaps }>`
  height: ${p => p.theme.space[p.gap ?? "none"]}px;
`;

export default Spacer;
