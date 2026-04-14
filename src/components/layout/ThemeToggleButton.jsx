import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const ToggleButton = styled.button`
  background: ${({ theme }) => theme.primaryLight};
  border: 1px solid ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.primary};
  border-radius: 50%;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    border-color: ${({ theme }) => theme.primary};
    transform: rotate(15deg) scale(1.05);
    box-shadow: 0 0 12px ${({ theme }) => theme.primary}44;
  }

  &:active svg {
    animation: ${spin} 0.5s ease-in-out;
  }

  svg {
    height: 1rem;
    width: 1rem;
    transition: transform 0.3s ease;
  }
`;

const ThemeToggleButton = ({ toggleTheme, currentTheme }) => {
  const isLight = currentTheme === 'light';
  return (
    <ToggleButton onClick={toggleTheme} title={isLight ? "Ativar tema escuro" : "Ativar tema claro"}>
      {isLight ? <FaMoon /> : <FaSun />}
    </ToggleButton>
  );
};

export default ThemeToggleButton;