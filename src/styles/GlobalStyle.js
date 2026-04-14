import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    transition: background-color 0.4s ease, color 0.4s ease;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    transition: color 0.2s ease-in-out;
  }

  a:hover {
    color: ${({ theme }) => theme.primaryDark};
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.text};
    margin-bottom: 0.75rem;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  h1 { font-size: 2.25rem; font-weight: 700; letter-spacing: -0.025em; }
  h2 { font-size: 1.75rem; font-weight: 600; }
  h3 { font-size: 1.375rem; }

  p {
    margin-bottom: 1rem;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  /* ---- Selection ---- */
  ::selection {
    background: ${({ theme }) => theme.primary};
    color: white;
  }

  /* ---- Custom Scrollbar ---- */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.body};
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.borderColor};
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.primary};
    background-clip: content-box;
  }

  /* ---- Focus Ring ---- */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* ---- Smooth image rendering ---- */
  img, video, iframe {
    max-width: 100%;
    border-radius: 8px;
  }
`;