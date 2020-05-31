import { css } from "styled-components";

const danger = css`
  color: ${p => p.theme.colors.redDark};
  background-color: ${p => p.theme.colors.red};
`;
const primary = css`
  color: ${p => p.theme.colors.greenDark};
  background-color: ${p => p.theme.colors.primary};
`;
const secondary = css`
  color: ${p => p.theme.colors.white};
  background-color: ${p => p.theme.colors.gray};
`;

export type VariantTypes = "primary" | "danger" | "secondary";

export default {
  danger,
  primary,
  secondary,
};
