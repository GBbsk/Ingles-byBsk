import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaGraduationCap, FaHome, FaLayerGroup, FaSignInAlt } from 'react-icons/fa';
import ThemeToggleButton from './ThemeToggleButton';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background: ${({ theme }) => theme.headerBg};
  border-bottom: 1px solid ${({ theme }) => theme.headerBorder};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;
  transition: background 0.3s, border-color 0.3s;

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
  }
`;

const LogoArea = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  letter-spacing: -0.02em;
  text-decoration: none;

  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.text};
  }

  svg {
    color: ${({ theme }) => theme.primary};
    font-size: 1.4rem;
  }

  span {
    background: ${({ theme }) => theme.accentGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 576px) {
    font-size: 1.1rem;
    svg { font-size: 1.2rem; }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 576px) {
    gap: 0;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme, $active }) => $active ? theme.primary : theme.secondaryText};
  background: ${({ theme, $active }) => $active ? theme.primaryLight : 'transparent'};
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.primaryLight};
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
  }

  svg {
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    padding: 0.45rem 0.6rem;
    font-size: 0;

    svg {
      font-size: 1.1rem;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Header = ({ toggleTheme, currentTheme }) => {
  const location = useLocation();
  const path = location.pathname;

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
        <ThemeToggleButton toggleTheme={toggleTheme} currentTheme={currentTheme} />
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;