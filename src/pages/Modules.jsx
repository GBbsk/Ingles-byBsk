import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Card from '../components/ui/Card';
import { useUserProgress } from '../hooks/useUserProgress';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const PageHeader = styled.div`
  margin-bottom: 3.5rem;
  padding: 3rem 2rem;
  text-align: center;
  background: ${({ theme }) => theme.glassBg || 'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.glassBorder || 'rgba(255, 255, 255, 0.1)'};
  box-shadow: ${({ theme }) => theme.glassGlow || '0 8px 32px rgba(0, 0, 0, 0.2)'};
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

  @media (max-width: 576px) {
    margin-bottom: 2rem;
    padding: 2rem 1.25rem;
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
`;

const PageTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
  letter-spacing: -0.04em;
  
  span {
    background: ${({ theme }) => theme.accentGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
  @media (max-width: 576px) {
    font-size: 1.8rem;
  }
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 1.15rem;
  max-width: 650px;
  margin: 0 auto 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding-bottom: 3rem;
  animation: ${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ProgressSummary = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const SummaryPill = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.secondaryText};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: ${({ theme }) => theme.primary}44;
    transform: translateY(-2px);
  }

  strong {
    color: ${({ theme }) => theme.primary};
    font-size: 1.1rem;
  }
`;

function Modules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getModuleProgress, getTotalCompleted } = useUserProgress();

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
          // Sanitizar os dados
          const sanitizedModules = data.map((module) => ({
            ...module,
            lessons: Array.isArray(module.lessons) ? module.lessons : [],
          }));
          const sortedModules = [...sanitizedModules].sort((a, b) => a.order - b.order);
          setModules(sortedModules);
        } else {
          throw new Error("A API não retornou um formato JSON válido.");
        }
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar os módulos (Modules):', error);
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const totalCompleted = getTotalCompleted();
  const totalLessons = modules.reduce(
    (sum, m) => sum + (Array.isArray(m.lessons) ? m.lessons.length : 0),
    0
  );
  const modulesFinished = modules.filter(
    (m) =>
      Array.isArray(m.lessons) &&
      m.lessons.length > 0 &&
      getModuleProgress(m.id, m.lessons) >= 100
  ).length;

  return (
    <div className="modules-container">
      <PageHeader>
        <HeaderContent>
          <PageTitle>Nossos <span>Módulos</span></PageTitle>
          <PageDescription>
            Domine o inglês com uma jornada estruturada. Explore aulas em vídeo, materiais de apoio e áudios interativos em cada etapa.
          </PageDescription>

          {totalCompleted > 0 && !loading && (
            <ProgressSummary>
              <SummaryPill>
                <strong>{totalCompleted}</strong> aulas concluídas
              </SummaryPill>
              <SummaryPill>
                <strong>{modulesFinished}/{modules.length}</strong> módulos finalizados
              </SummaryPill>
              <SummaryPill>
                Sucesso: <strong>{totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0}%</strong>
              </SummaryPill>
            </ProgressSummary>
          )}
        </HeaderContent>
      </PageHeader>

      {loading ? (
        <LoadingContainer>Carregando módulos...</LoadingContainer>
      ) : (
        <ModulesGrid>
          {modules.map((module) => (
            <Card
              key={module.id}
              title={module.title}
              description={module.description}
              image={module.image}
              badge={`${Array.isArray(module.lessons) ? module.lessons.length : 0} aulas`}
              progress={getModuleProgress(module.id, module.lessons || [])}
              linkTo={`/modulos/${module.id}`}
            />
          ))}
        </ModulesGrid>
      )}
    </div>
  );
}

export default Modules;