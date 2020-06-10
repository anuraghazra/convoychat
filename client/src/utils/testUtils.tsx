import React from "react";
import { ThemeProvider } from "styled-components";
import { render, RenderResult } from "@testing-library/react";
import theme from "../styles/theme";

export function renderWithStyledTheme(
  component: React.ReactNode,
  renderFunction: any = render
): RenderResult {
  return {
    ...renderFunction(<ThemeProvider theme={theme}>{component}</ThemeProvider>),
  };
}
