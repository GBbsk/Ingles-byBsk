import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa';
import Button from '../components/ui/Button';
import { useUserProgress } from '../hooks/useUserProgress';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const ModuleContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.5s ease-out;
  
  @media (max-width: 576px) {
    padding: 1.25rem;
    border-radius: 8px;
  }
`;

const ModuleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const ModuleImage = styled.div`
  width: 200px;
  height: 150px;
  border-radius: 8px;
  background-image: url(${({ image }) => image});
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 180px;
  }
`;

const ModuleInfo = styled.div`
  flex: 1;
`;

const ModuleTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text};
  
  @media (max-width: 576px) {
    font-size: 1.5rem;
  }
`;

const ModuleDescription = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const ModuleProgressWrapper = styled.div`
  margin-top: 0.5rem;

  .module-prog-label {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.secondaryText};
    margin-bottom: 0.35rem;
    display: flex;
    justify-content: space-between;

    strong {
      color: ${({ theme }) => theme.primary};
    }
  }

  .module-prog-bar {
    height: 8px;
    background-color: ${({ theme }) => theme.borderColor};
    border-radius: 4px;
    overflow: hidden;

    div {
      height: 100%;
      background: ${({ $progress, theme }) =>
    $progress >= 100
      ? theme.success
      : `linear-gradient(90deg, ${theme.primary}, #e50914)`};
      border-radius: 4px;
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
`;

const LessonsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LessonCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme, $completed }) => $completed ? theme.success + '33' : theme.cardBorder};
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.25rem;
    gap: 1rem;
  }
`;

const LessonNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme, $completed }) => $completed ? theme.success : theme.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
  transition: background-color 0.3s;
`;

const LessonInfo = styled.div`
  flex: 1;
`;

const LessonTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CompletedTag = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${({ theme }) => theme.success};
  background-color: ${({ theme }) => theme.success + '15'};
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
`;

const LessonDescription = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const LessonMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.secondaryText};
  
  @media (max-width: 576px) {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
`;

const LessonDuration = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const BackButton = styled(Button)`
  margin-bottom: 1.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.secondaryText};
`;

function ModuleDetail() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLessonCompleted, getModuleProgress } = useUserProgress();

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await fetch(`/api/modules/${moduleId}`);
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();

        if (data) {
          data.lessons = [...(data.lessons || [])].sort((a, b) => a.order - b.order);
          setModule(data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar o módulo:', error);
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  const handleLessonClick = (lessonId) => {
    navigate(`/modulos/${moduleId}/aula/${lessonId}`);
  };

  if (loading) {
    return <LoadingContainer>Carregando módulo...</LoadingContainer>;
  }

  if (!module) {
    return (
      <div>
        <BackButton
          variant="outline"
          onClick={() => navigate('/modulos')}
        >
          ← Voltar para Módulos
        </BackButton>
        <p>Módulo não encontrado.</p>
      </div>
    );
  }

  const moduleProgress = getModuleProgress(module.id, module.lessons || []);

  return (
    <div>
      <BackButton
        variant="outline"
        onClick={() => navigate('/modulos')}
      >
        ← Voltar para Módulos
      </BackButton>

      <ModuleContainer>
        <ModuleHeader>
          <ModuleImage image={module.image} />
          <ModuleInfo>
            <ModuleTitle>{module.title}</ModuleTitle>
            <ModuleDescription>{module.description}</ModuleDescription>
            <div>{module.lessons.length} aulas</div>
            <ModuleProgressWrapper $progress={moduleProgress}>
              <div className="module-prog-label">
                <span>Progresso do Módulo</span>
                <strong>{moduleProgress}%</strong>
              </div>
              <div className="module-prog-bar">
                <div style={{ width: `${moduleProgress}%` }}></div>
              </div>
            </ModuleProgressWrapper>
          </ModuleInfo>
        </ModuleHeader>

        <LessonsList>
          {module.lessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.id);
            return (
              <LessonCard
                key={lesson.id}
                onClick={() => handleLessonClick(lesson.id)}
                $completed={completed}
              >
                <LessonNumber $completed={completed}>
                  {completed ? <FaCheckCircle /> : index + 1}
                </LessonNumber>
                <LessonInfo>
                  <LessonTitle>
                    {lesson.title}
                    {completed && <CompletedTag>Concluída</CompletedTag>}
                  </LessonTitle>
                  <LessonDescription>{lesson.description}</LessonDescription>
                  <LessonMeta>
                    <LessonDuration>
                      <span>⏱️</span> {lesson.duration || '—'}
                    </LessonDuration>
                    {lesson.files && lesson.files.length > 0 && (
                      <span>📄 {lesson.files.length} arquivos</span>
                    )}
                    {lesson.audios && lesson.audios.length > 0 && (
                      <span>🔊 {lesson.audios.length} áudios</span>
                    )}
                  </LessonMeta>
                </LessonInfo>
              </LessonCard>
            );
          })}
        </LessonsList>
      </ModuleContainer>
    </div>
  );
}

export default ModuleDetail;