import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useUserProgress } from '../hooks/useUserProgress';
import { FaPlay, FaCheckCircle, FaBookOpen, FaChartLine } from 'react-icons/fa';

// --- Animations ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(229, 9, 20, 0.15); }
  50% { box-shadow: 0 0 35px rgba(229, 9, 20, 0.3); }
`;

// --- Styled Components ---
const HeroSection = styled.section`
  background: ${({ theme }) => theme.glassBg || 'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.glassBorder || 'rgba(255, 255, 255, 0.1)'};
  box-shadow: ${({ theme }) => theme.glassGlow || '0 8px 32px rgba(0, 0, 0, 0.2)'};
  color: white;
  padding: 4rem 2rem;
  margin-bottom: 3.5rem;
  text-align: center;
  animation: ${fadeInUp} 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, ${({ theme }) => theme.primary}11 0%, transparent 70%);
    z-index: 0;
  }

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    margin-bottom: 2.5rem;
    border-radius: 18px;
  }

  @media (max-width: 576px) {
    padding: 2rem 1.25rem;
    border-radius: 12px;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.25rem;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.text};
  
  span {
    background: ${({ theme }) => theme.accentGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.9rem;
    margin-bottom: 1rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto 2.5rem;
  color: ${({ theme }) => theme.secondaryText};
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.05rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  letter-spacing: -0.02em;
  
  svg {
    color: ${({ theme }) => theme.primary};
    font-size: 1.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.7rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3.5rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

// --- Continue Watching Section ---
const ContinueWatchingCard = styled.div`
  background: ${({ theme }) => theme.glassBg || 'rgba(255, 255, 255, 0.03)'};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.glassBorder || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 20px;
  padding: 1.5rem 2rem;
  margin-bottom: 3.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeInUp} 0.5s ease-out;

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.06);
    border-color: ${({ theme }) => theme.primary}44;
    box-shadow: ${({ theme }) => theme.glassGlow || '0 8px 32px rgba(0, 0, 0, 0.2)'};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
    gap: 1.25rem;
    border-radius: 16px;
  }
`;

const ContinuePlayIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.accentGradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;

  ${ContinueWatchingCard}:hover & {
    transform: scale(1.1);
  }
`;

const ContinueInfo = styled.div`
  flex: 1;

  h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
    margin-bottom: 0.35rem;
    letter-spacing: -0.01em;
  }

  p {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.secondaryText};
    margin: 0;
    opacity: 0.8;
  }
`;

const ContinueButton = styled(Button)`
  white-space: nowrap;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

// --- Stats Dashboard ---
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 4rem;
  animation: ${fadeInUp} 0.65s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.glassBg || 'rgba(255, 255, 255, 0.03)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid ${({ theme }) => theme.glassBorder || 'rgba(255, 255, 255, 0.08)'};
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.06);
    border-color: ${({ theme }) => theme.primary}33;
  }
`;

const StatIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${({ $color }) => $color || 'linear-gradient(135deg, #667eea, #764ba2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.4rem;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
`;

const StatContent = styled.div`
  h4 {
    font-size: 1.6rem;
    font-weight: 800;
    color: ${({ theme }) => theme.text};
    margin: 0;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  p {
    font-size: 0.85rem;
    font-weight: 600;
    color: ${({ theme }) => theme.secondaryText};
    margin-top: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.7;
  }
`;

function Home() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {
    getLastWatched,
    getTotalCompleted,
    getModuleProgress,
  } = useUserProgress();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('/api/modules');
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setModules(Array.isArray(data) ? data : []);
        } else {
          throw new Error("A API não retornou um formato JSON válido.");
        }
      } catch (error) {
        console.error('Erro ao carregar módulos:', error);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const lastWatched = getLastWatched();
  const totalCompleted = getTotalCompleted();
  const totalLessons = modules.reduce(
    (sum, m) => sum + (Array.isArray(m.lessons) ? m.lessons.length : 0),
    0
  );
  const modulesCompleted = modules.filter(
    (m) => Array.isArray(m.lessons) && m.lessons.length > 0 && getModuleProgress(m.id, m.lessons) >= 100
  ).length;

  // Encontrar dados do "Continue Assistindo"
  let continueModule = null;
  let continueLesson = null;
  if (lastWatched && modules.length > 0) {
    continueModule = modules.find((m) => m.id === lastWatched.moduleId);
    if (continueModule && Array.isArray(continueModule.lessons)) {
      continueLesson = continueModule.lessons.find(
        (l) => l.id === lastWatched.lessonId
      );
    }
  }

  return (
    <div style={{ padding: '0 1rem' }}>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Aprenda Inglês de <span>Forma Eficiente</span></HeroTitle>
          <HeroSubtitle>
            Nossa plataforma oferece um método comprovado para você dominar o inglês
            com aulas interativas, áudios e materiais exclusivos.
          </HeroSubtitle>
          <Button
            size="large"
            onClick={() => navigate('/modulos')}
          >
            Começar Agora
          </Button>
        </HeroContent>
      </HeroSection>

      {/* Continue Assistindo */}
      {continueModule && continueLesson && (
        <ContinueWatchingCard
          onClick={() =>
            navigate(
              `/modulos/${continueModule.id}/aula/${continueLesson.id}`
            )
          }
        >
          <ContinuePlayIcon>
            <FaPlay />
          </ContinuePlayIcon>
          <ContinueInfo>
            <h3>Continue de onde parou</h3>
            <p>
              {continueModule.title} → {continueLesson.title}
            </p>
          </ContinueInfo>
          <ContinueButton>Continuar</ContinueButton>
        </ContinueWatchingCard>
      )}

      {/* Mini Dashboard de Estatísticas */}
      {totalCompleted > 0 && (
        <StatsRow>
          <StatCard>
            <StatIcon $color="linear-gradient(135deg, #667eea, #764ba2)">
              <FaCheckCircle />
            </StatIcon>
            <StatContent>
              <h4>{totalCompleted}</h4>
              <p>Aulas Concluídas</p>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon $color="linear-gradient(135deg, #f093fb, #f5576c)">
              <FaBookOpen />
            </StatIcon>
            <StatContent>
              <h4>{modulesCompleted}/{modules.length}</h4>
              <p>Módulos Finalizados</p>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon $color="linear-gradient(135deg, #4facfe, #00f2fe)">
              <FaChartLine />
            </StatIcon>
            <StatContent>
              <h4>
                {totalLessons > 0
                  ? Math.round((totalCompleted / totalLessons) * 100)
                  : 0}
                %
              </h4>
              <p>Progresso Geral</p>
            </StatContent>
          </StatCard>
        </StatsRow>
      )}

      <section>
        <SectionTitle>Módulos em Destaque</SectionTitle>

        {loading ? (
          <p>Carregando módulos...</p>
        ) : (
          <ModulesGrid>
            {modules.slice(0, 3).map((module) => (
              <Card
                key={module.id}
                title={module.title}
                description={module.description}
                image={module.image}
                badge={`${module.lessons ? module.lessons.length : 0} aulas`}
                progress={getModuleProgress(module.id, module.lessons || [])}
                linkTo={`/modulos/${module.id}`}
              />
            ))}
          </ModulesGrid>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Button
            variant="outline"
            onClick={() => navigate('/modulos')}
          >
            Ver Todos os Módulos
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Home;