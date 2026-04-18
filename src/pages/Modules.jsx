import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Card from '../components/ui/Card';
import { useUserProgress } from '../hooks/useUserProgress';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  padding: 0 1rem;
  animation: ${fadeInUp} 0.5s ease-out;

  @media (max-width: 576px) {
    margin-bottom: 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text};
  transition: font-size 0.3s ease;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
  @media (max-width: 576px) {
    font-size: 1.6rem;
  }
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 1.1rem;
  max-width: 750px;
  line-height: 1.6;
  transition: font-size 0.3s ease;

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: 1rem;
  }
  @media (max-width: 576px) {
    font-size: 0.95rem;
  }
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 0 1rem;
  animation: ${fadeInUp} 0.6s ease-out;

  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.25rem;
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 0.5rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.secondaryText};
  transition: min-height 0.3s ease;
  
  @media (max-width: 768px) {
    min-height: 250px;
    font-size: 1rem;
  }
  
  @media (max-width: 576px) {
    min-height: 200px;
  }
`;

const ProgressSummary = styled.div`
  padding: 0 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  animation: ${fadeInUp} 0.55s ease-out;
`;

const SummaryPill = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 20px;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.secondaryText};
  font-weight: 500;

  strong {
    color: ${({ theme }) => theme.primary};
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
        <PageTitle>Módulos do Curso</PageTitle>
        <PageDescription>
          Explore todos os módulos disponíveis no nosso curso de inglês.
          Cada módulo contém aulas em vídeo, arquivos para download e áudios com transcrição.
        </PageDescription>
      </PageHeader>

      {totalCompleted > 0 && !loading && (
        <ProgressSummary>
          <SummaryPill>
            <strong>{totalCompleted}</strong> aulas concluídas
          </SummaryPill>
          <SummaryPill>
            <strong>{modulesFinished}/{modules.length}</strong> módulos finalizados
          </SummaryPill>
          <SummaryPill>
            Progresso geral: <strong>{totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0}%</strong>
          </SummaryPill>
        </ProgressSummary>
      )}

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