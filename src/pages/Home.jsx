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
  background: linear-gradient(135deg, ${({ theme }) => theme.primary} 0%, ${({ theme }) => theme.primaryDark} 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 18px;
  margin-bottom: 3rem;
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    margin-bottom: 2rem;
    border-radius: 12px;
  }

  @media (max-width: 576px) {
    padding: 2rem 0.7rem;
    border-radius: 8px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.8rem;
    margin-bottom: 0.75rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 576px) {
    font-size: 0.95rem;
    margin-bottom: 1.25rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 0.6rem;
  
  svg {
    color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 1.25rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }
`;

// --- Continue Watching Section ---
const ContinueWatchingCard = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.cardBg} 0%, ${({ theme }) => theme.primaryLight} 100%);
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  animation: ${fadeInUp} 0.5s ease-out, ${pulseGlow} 3s ease-in-out infinite;

  &:hover {
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
    gap: 1rem;
  }
`;

const ContinuePlayIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e50914, #b20710);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.35);
  transition: transform 0.2s;

  ${ContinueWatchingCard}:hover & {
    transform: scale(1.1);
  }
`;

const ContinueInfo = styled.div`
  flex: 1;

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.secondaryText};
    margin: 0;
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
  margin-bottom: 3rem;
  animation: ${fadeInUp} 0.65s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${({ $color }) => $color || 'linear-gradient(135deg, #667eea, #764ba2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const StatContent = styled.div`
  h4 {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
    margin: 0;
    line-height: 1.2;
  }
  p {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.secondaryText};
    margin: 0;
  }
`;

// --- Features Section (maintained from original) ---
const FeaturesSection = styled.section`
  margin: 4rem 0;
  animation: ${fadeInUp} 0.7s ease-out;
  
  @media (max-width: 768px) {
    margin: 3rem 0;
  }
  
  @media (max-width: 576px) {
    margin: 2.5rem 0;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const FeatureCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  }
  
  @media (max-width: 768px) {
    padding: 1.75rem;
  }
  
  @media (max-width: 576px) {
    padding: 1.5rem;
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
    margin-bottom: 0.75rem;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text};
  
  @media (max-width: 576px) {
    font-size: 1.1rem;
  }
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 0.9rem;
  
  @media (max-width: 576px) {
    font-size: 0.85rem;
  }
`;

const CTASection = styled.section`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
    margin: 3rem 0;
    border-radius: 10px;
  }
  
  @media (max-width: 576px) {
    padding: 2rem 1rem;
    margin: 2.5rem 0;
    border-radius: 8px;
  }
`;

const CTATitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.4rem;
    margin-bottom: 0.75rem;
  }
`;

const CTADescription = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 1rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 576px) {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
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
        const data = await response.json();
        setModules(Array.isArray(data) ? data : []);
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
        <HeroTitle>Aprenda Inglês de Forma Eficiente</HeroTitle>
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

      <FeaturesSection>
        <SectionTitle>Por que escolher nossa plataforma?</SectionTitle>

        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🎓</FeatureIcon>
            <FeatureTitle>Conteúdo Exclusivo</FeatureTitle>
            <FeatureDescription>
              Aulas preparadas por professores experientes com foco na fluência e comunicação.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🔊</FeatureIcon>
            <FeatureTitle>Áudios com Transcrição</FeatureTitle>
            <FeatureDescription>
              Pratique a compreensão auditiva com nossos áudios exclusivos e acompanhe a transcrição em tempo real.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>Acesso em Qualquer Dispositivo</FeatureTitle>
            <FeatureDescription>
              Estude quando e onde quiser através do seu computador, tablet ou smartphone.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <CTASection>
        <CTATitle>Pronto para dominar o inglês?</CTATitle>
        <CTADescription>
          Comece agora mesmo a estudar com nossa metodologia exclusiva e
          alcance a fluência que você sempre desejou.
        </CTADescription>
        <Button
          size="large"
          onClick={() => navigate('/modulos')}
        >
          Acessar Módulos
        </Button>
      </CTASection>
    </div>
  );
}

export default Home;