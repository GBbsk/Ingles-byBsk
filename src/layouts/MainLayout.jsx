import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaGraduationCap, FaHeart } from 'react-icons/fa';

const HEADER_HEIGHT = '60px'; 

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding-top: ${HEADER_HEIGHT};
  padding-bottom: 2rem;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;

  @media (max-width: 576px) {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
`;

const FooterStyled = styled.footer`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 2.5rem 0 1.5rem;
  margin-top: 4rem;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.25rem;

  svg {
    color: ${({ theme }) => theme.primary};
  }

  span {
    background: ${({ theme }) => theme.accentGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    align-items: center;
  }
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.secondaryText};
  transition: color 0.2s ease;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.35rem;
  border-radius: 6px;

  &:hover {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${({ theme }) => theme.borderColor};
  width: 100%;
  max-width: 400px;
  margin: 0 auto 1rem;
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  svg {
    color: #ef4444;
    font-size: 0.7rem;
  }
`;

function MainLayout() {
  const navigate = useNavigate();

  const handleFooterNavigation = (path) => {
    navigate(path);
  };

  return (
    <LayoutContainer>
      <MainContent>
        <Outlet />
      </MainContent>

      <FooterStyled>
        <FooterContent>
          <FooterLogo>
            <FaGraduationCap />
            <span>English Platform</span>
          </FooterLogo>
          <FooterLinks>
            <FooterLink onClick={() => handleFooterNavigation('/')}>Home</FooterLink>
            <FooterLink onClick={() => handleFooterNavigation('/modulos')}>Módulos</FooterLink>
            <FooterLink onClick={() => handleFooterNavigation('/login')}>Área do Aluno</FooterLink>
          </FooterLinks>
          <Divider />
          <Copyright>
            Feito com <FaHeart /> — © {new Date().getFullYear()} English Platform
          </Copyright>
        </FooterContent>
      </FooterStyled>
    </LayoutContainer>
  );
}

export default MainLayout;