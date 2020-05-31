import { DefaultTheme, CSSProp } from "styled-components";
import colorVariants from "@convoy-ui/colorVariants";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    variants: {
      primary: CSSProp;
      secondary: CSSProp;
      danger: CSSProp;
    };
    colors: {
      primary: string;
      red: string;
      redDark: string;
      greenDark: string;
      gray: string;
      white: string;
      dark1: string;
      dark2: string;
      dark3: string;
    };
    font: {
      primary: string;
      primaryBold: string;
      primaryItalic: string;
      primaryMedium: string;
      primaryLight: string;
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
  red: "#EB4C5F",
  redDark: '#410008',
  greenDark: '#004108',
  dark1: "#161A2D",
  dark2: "#0D1022",
  dark3: "#090C1B",
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
  variants: {
    ...colorVariants
  },
  font: {
    primary: "Product Sans Regular",
    primaryBold: "Product Sans Bold",
    primaryItalic: "Product Sans Italic",
    primaryMedium: "Product Sans Medium Regular",
    primaryLight: "Product Sans Light Regular",
  },
  colors,
  space: {
    none: 0,
    small: 5,
    medium: 10,
    large: 15,
    xlarge: 20,
    huge: 45,
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
