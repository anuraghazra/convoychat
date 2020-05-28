import { DefaultTheme, CSSProp } from 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
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
  }
}

const colors = {
  primary: '#586FFA',
  secondary: '#8B9AF4',
};

const size = {
  mobileS: '320px',
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  desktopL: '1440px'
};

const theme: DefaultTheme = {
  font: {
    primary: 'Product Sans Regular',
    primaryBold: 'Product Sans Bold',
    primaryItalic: 'Product Sans Italic',
    primaryMedium: 'Product Sans Medium Regular',
    primaryLight: 'Product Sans Light Regular'
  },
  colors,
  spacings: {
    top: 40,
    bottom: 40,
    left: 25,
    right: 25,
    my: '20px',
    mx: '20px'
  },
  space: {
    none: 0,
    small: 5,
    medium: 10,
    large: 15,
    xlarge: 30,
    huge: 40
  },
  media: {
    mobileS: `max-width: ${size.mobileS}`,
    mobile: `max-width: ${size.mobile}`,
    tablet: `max-width: ${size.tablet}`,
    minTablet: `min-width: ${size.tablet}`,
    desktop: `max-width: ${size.desktop}`,
    desktopL: `max-width: ${size.desktopL}`
  }
};

export default theme;