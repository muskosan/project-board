import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { tokens } from './tokens';
import { GlobalStyles } from './GlobalStyles';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <StyledThemeProvider theme={tokens}>
      <GlobalStyles />
      {children}
    </StyledThemeProvider>
  );
};

// Helper function for media queries
export const media = {
  mobile: `@media (min-width: ${tokens.breakpoints.mobile})`,
  tablet: `@media (min-width: ${tokens.breakpoints.tablet})`,
  desktop: `@media (min-width: ${tokens.breakpoints.desktop})`,
  wide: `@media (min-width: ${tokens.breakpoints.wide})`,
};