import { createGlobalStyle } from 'styled-components';

// Color scheme as requested
const colors = {
  primary: '#7FBD32', // Light green
  secondary: '#87CEEB', // Light sky blue
  background: '#FFFFFF', // White background
  text: '#333333',
  lightGrey: '#F5F5F5',
  darkGrey: '#777777',
  danger: '#FF6B6B',
  success: '#28A745'
};

export const theme = {
  colors,
  fonts: {
    body: "'Poppins', sans-serif",
    heading: "'Poppins', sans-serif"
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    large: '1200px'
  },
  shadows: {
    small: '0 2px 5px rgba(0, 0, 0, 0.1)',
    medium: '0 5px 15px rgba(0, 0, 0, 0.15)',
    large: '0 10px 25px rgba(0, 0, 0, 0.2)'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%'
  }
};

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: ${theme.fonts.body};
    color: ${theme.colors.text};
    font-size: 16px;
    line-height: 1.6;
    background-color: ${theme.colors.background};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.75rem;
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${theme.colors.secondary};
    }
  }

  button, input, textarea, select {
    font-family: inherit;
  }

  button {
    cursor: pointer;
  }

  ul, ol {
    list-style-position: inside;
    margin-bottom: 1rem;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    html {
      font-size: 14px;
    }
  }
`; 