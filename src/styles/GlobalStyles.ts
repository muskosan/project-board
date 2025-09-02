import { createGlobalStyle } from 'styled-components';
import { tokens } from './tokens';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    line-height: ${tokens.typography.lineHeights.normal};
    scroll-behavior: smooth;
  }

  body {
    font-family: ${tokens.typography.fonts.primary};
    font-size: ${tokens.typography.sizes.base};
    font-weight: ${tokens.typography.weights.normal};
    color: ${tokens.colors.text.primary};
    background-color: ${tokens.colors.background.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  #root {
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${tokens.typography.fonts.heading};
    font-weight: ${tokens.typography.weights.semibold};
    line-height: ${tokens.typography.lineHeights.tight};
    letter-spacing: ${tokens.typography.letterSpacing.tight};
  }

  h1 {
    font-size: ${tokens.typography.sizes['4xl']};
    font-weight: ${tokens.typography.weights.bold};
  }

  h2 {
    font-size: ${tokens.typography.sizes['3xl']};
    font-weight: ${tokens.typography.weights.bold};
  }

  h3 {
    font-size: ${tokens.typography.sizes['2xl']};
    font-weight: ${tokens.typography.weights.semibold};
  }

  h4 {
    font-size: ${tokens.typography.sizes.xl};
    font-weight: ${tokens.typography.weights.semibold};
  }

  h5 {
    font-size: ${tokens.typography.sizes.lg};
    font-weight: ${tokens.typography.weights.medium};
  }

  h6 {
    font-size: ${tokens.typography.sizes.base};
    font-weight: ${tokens.typography.weights.medium};
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    transition: ${tokens.transitions.colors};
    
    &:focus-visible {
      outline: none;
      box-shadow: ${tokens.shadows.focus};
    }
  }

  input, textarea, select {
    font-family: inherit;
    
    &:focus-visible {
      outline: none;
    }
  }

  a {
    color: ${tokens.colors.interactive.primary};
    text-decoration: none;
    transition: ${tokens.transitions.colors};
    
    &:hover {
      color: ${tokens.colors.interactive.primaryHover};
    }
    
    &:focus-visible {
      outline: none;
      box-shadow: ${tokens.shadows.focus};
      border-radius: ${tokens.borderRadius.sm};
    }
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Custom scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${tokens.colors.surface[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${tokens.colors.surface[300]};
    border-radius: ${tokens.borderRadius.base};
    
    &:hover {
      background: ${tokens.colors.surface[400]};
    }
  }

  /* Selection styles */
  ::selection {
    background-color: ${tokens.colors.interactive.primary}20;
    color: ${tokens.colors.text.primary};
  }
`;
