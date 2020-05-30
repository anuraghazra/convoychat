import { DefaultTheme, CSSProp } from "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      dark: string;
      darken: string;
      darkest: string;
      gray: string;
      white: string;
    };
    font: {
      primary: string;
      primaryBold: string;
      primaryItalic: string;
      primaryMedium: string;
      primaryLight: string;
    };
    spacings: {
      top: number;
      bottom: number;
      left: number;
      right: number;
      my: string;
      mx: string;
    };
    space: {
      none: number;
      small: number;
      medium: number;
      large: number;
      xlarge: number;
      huge: number;
    };
    media: {
      mobileS: string;
      mobile: string;
      tablet: string;
      minTablet: string;
      desktop: string;
      desktopL: string;
    };
    radius: {
      small: number;
    };
  }
}

const colors = {
  primary: "#64FF8F",
  dark: "#161A2D",
  darken: "#0D1022",
  darkest: "#090C1B",
  gray: "#7A7F96",
  white: "#F5F5F5",
};

const size = {
  mobileS: "320px",
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
  desktopL: "1440px",
};

const theme: DefaultTheme = {
  font: {
    primary: "Product Sans Regular",
    primaryBold: "Product Sans Bold",
    primaryItalic: "Product Sans Italic",
    primaryMedium: "Product Sans Medium Regular",
    primaryLight: "Product Sans Light Regular",
  },
  colors,
  spacings: {
    top: 60,
    bottom: 60,
    left: 25,
    right: 25,
    my: "20px",
    mx: "20px",
  },
  space: {
    none: 0,
    small: 5,
    medium: 10,
    large: 15,
    xlarge: 30,
    huge: 40,
  },
  media: {
    mobileS: `max-width: ${size.mobileS}`,
    mobile: `max-width: ${size.mobile}`,
    tablet: `max-width: ${size.tablet}`,
    minTablet: `min-width: ${size.tablet}`,
    desktop: `max-width: ${size.desktop}`,
    desktopL: `max-width: ${size.desktopL}`,
  },
  radius: {
    small: 5,
  },
};

export default theme;
