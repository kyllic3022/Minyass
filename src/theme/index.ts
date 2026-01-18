import { TextStyle } from 'react-native';

export const Colors = {
  // Base Neutrals
  VoidBlack: '#0B0B0F',
  DeepNight: '#0A1023',
  ShadowPurple: '#2A1238',

  // Accents
  BordoRed: '#4B0F1B',
  EmberRed: '#7A1C2B',
  StarBlue: '#2E3B6F',
  Starlight: '#E8E6F0',

  // Utility
  White: '#FFFFFF',
  Transparent: 'transparent',
};

export const Typography = {
  // In a real app we'd load these fonts, for now we map to system fonts
  Headings: {
    fontFamily: 'System',
    fontWeight: '700',
  } as TextStyle,
  Body: {
    fontFamily: 'System',
    fontWeight: '400',
  } as TextStyle,
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

export const Layout = {
  radius: 16,
};
