// theme.ts

import { ColorSchemeName, TextStyle } from 'react-native';

// Define the shape of our color palette
export type Colors = {
  bg: string;
  card: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  subtext: string;
  border: string;
};

// Light theme palette
const Light: Colors = {
  bg:        '#F7F8FA',
  card:      '#FFFFFF',
  primary:   '#2D9CDB',
  secondary: '#27AE60',
  accent:    '#F2C94C',
  text:      '#333333',
  subtext:   '#666666',
  border:    '#E0E0E0'
};

// Dark theme palette
const Dark: Colors = {
  bg:        '#121212',
  card:      '#1E1E1E',
  primary:   '#2D9CDB',
  secondary: '#27AE60',
  accent:    '#F2C94C',
  text:      '#E0E0E0',
  subtext:   '#AAAAAA',
  border:    '#333333'
};

/**
 * Returns the active color palette based on the system scheme.
 */
export function getColors(scheme: ColorSchemeName | null): Colors {
  return scheme === 'dark' ? Light : Light;
}

// Typography styles for text elements using Manrope
export const Typography: {
  h1: TextStyle;
  h2: TextStyle;
  body: TextStyle;
  small: TextStyle;
} = {
  h1:    { fontSize: 28, fontFamily: 'Manrope-Bold' },
  h2:    { fontSize: 22, fontFamily: 'Manrope-Bold' },
  body:  { fontSize: 16, fontFamily: 'Manrope' },
  small: { fontSize: 14, fontFamily: 'Manrope-Light' }
};
