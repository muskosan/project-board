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
    line-height: 1.5;
  }

  body {
    font-family: ${tokens.typography.fonts.primary};
    font-size: ${tokens.typography.sizes.base};
    color: ${tokens.colors.text.primary};
    background-color: ${tokens.colors.background.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${tokens.typography.fonts.heading};
    font-weight: ${tokens.typography.weights.semibold};
    line-height: 1.2;
  }

  h1 {
    font-size: ${tokens.typography.sizes['4xl']};
  }

  h2 {
    font-size: ${tokens.typography.sizes['3xl']};
  }

  h3 {
    font-size: ${tokens.typography.sizes['2xl']};
  }

  h4 {
    font-size: ${tokens.typography.sizes.xl};
  }

  h5 {
    font-size: ${tokens.typography.sizes.lg};
  }

  h6 {
    font-size: ${tokens.typography.sizes.base};
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  input, textarea, select {
    font-family: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }
`;
