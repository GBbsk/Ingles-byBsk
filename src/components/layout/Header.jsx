import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaGraduationCap, FaHome, FaLayerGroup, FaSignInAlt, FaList } from 'react-icons/fa';
import ThemeToggleButton from './ThemeToggleButton';
import PlaylistSidebar from './PlaylistSidebar';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background: ${({ theme }) => theme.glassBg || 'rgba(15, 15, 26, 0.8)'};
  border-bottom: 1px solid ${({ theme }) => theme.headerBorder};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;
  transition: all 0.4s ease;

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
  }
`;

const LogoArea = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.4rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  letter-spacing: -0.04em;
  text-decoration: none;

  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.text};
    filter: drop-shadow(0 0 10px ${({ theme }) => theme.primary}44);
  }

  svg {
    color: ${({ theme }) => theme.primary};
    font-size: 1.6rem;
    filter: drop-shadow(0 0 8px ${({ theme }) => theme.primary}66);
  }

  span {
    background: ${({ theme }) => theme.accentGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 576px) {
    font-size: 1.2rem;
    svg { font-size: 1.3rem; }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.4rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 576px) {
    gap: 0.25rem;
    background: none;
    border: none;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme, $active }) => $active ? theme.primary : theme.secondaryText};
  background: ${({ theme, $active }) => $active ? theme.primaryLight : 'transparent'};
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.primaryLight};
    color: ${({ theme }) => theme.primary};
    transform: translateY(-1px);
  }

  ${({ $active, theme }) => $active && `
    box-shadow: 0 4px 12px ${theme.primary}22;
    border: 1px solid ${theme.primary}33;
  `}

  svg {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0;

    svg {
      font-size: 1.2rem;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconButton = styled.button`
  background: ${({ theme }) => theme.primaryLight};
  border: 1px solid ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.primary};
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    transform: rotate(15deg) scale(1.1);
    box-shadow: 0 0 15px ${({ theme }) => theme.primary}66;
  }
`;

const Header = ({ toggleTheme, currentTheme }) => {
  const location = useLocation();
  const path = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <HeaderContainer>
      <LogoArea to="/">
        <FaGraduationCap />
        <span>English Platform</span>
      </LogoArea>
      
      <Nav>
        <NavLink to="/" $active={path === '/'}>
          <FaHome /> Início
        </NavLink>
        <NavLink to="/modulos" $active={path.startsWith('/modulos')}>
          <FaLayerGroup /> Módulos
        </NavLink>
        <NavLink to="/login" $active={path === '/login'}>
          <FaSignInAlt /> Login
        </NavLink>
      </Nav>

      <RightSection>
        <IconButton onClick={() => setIsSidebarOpen(true)} aria-label="Open Playlists">
          <FaList />
        </IconButton>
        <ThemeToggleButton toggleTheme={toggleTheme} currentTheme={currentTheme} />
      </RightSection>

      <PlaylistSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </HeaderContainer>
  );
};

export default Header;