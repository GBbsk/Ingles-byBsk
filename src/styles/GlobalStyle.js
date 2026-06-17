import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
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
    transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    min-height: 100vh;
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    transition: all 0.3s ease;
  }

  a:hover {
    color: ${({ theme }) => theme.primaryDark};
    filter: drop-shadow(0 0 8px ${({ theme }) => theme.primary}66);
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.text};
    margin-bottom: 1rem;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  h1 { font-size: 2.5rem; letter-spacing: -0.04em; }
  h2 { font-size: 1.85rem; letter-spacing: -0.03em; }
  h3 { font-size: 1.45rem; }

  p {
    margin-bottom: 1.25rem;
    color: ${({ theme }) => theme.secondaryText};
  }

  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    outline: none;
  }

  /* ---- Selection ---- */
  ::selection {
    background: ${({ theme }) => theme.primary};
    color: white;
  }

  /* ---- Custom Scrollbar ---- */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.body};
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.borderColor};
    border-radius: 10px;
    border: 3px solid ${({ theme }) => theme.body};
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.primary};
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