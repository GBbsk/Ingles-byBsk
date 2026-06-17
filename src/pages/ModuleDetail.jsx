import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaCheckCircle, FaPlayCircle } from 'react-icons/fa';
import Button from '../components/ui/Button';
import { useUserProgress } from '../hooks/useUserProgress';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const ModuleContainer = styled.div`
  margin-bottom: 3rem;
  animation: ${fadeInUp} 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ModuleHeader = styled.div`
  background: ${({ theme }) => theme.glassBg || 'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.glassBorder || 'rgba(255, 255, 255, 0.1)'};
  padding: 2.5rem;
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 3rem;
  box-shadow: ${({ theme }) => theme.glassGlow || '0 8px 32px rgba(0, 0, 0, 0.2)'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 300px; height: 300px;
    background: radial-gradient(circle, ${({ theme }) => theme.primary}11 0%, transparent 70%);
    z-index: 0;
  }
  
  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
    padding: 2rem;
  }
`;

const ModuleImage = styled.div`
  width: 280px;
  height: 200px;
  border-radius: 16px;
  background-image: url(${({ image }) => image});
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1;
  
  @media (max-width: 992px) {
    width: 100%;
    max-width: 400px;
  }
`;

const ModuleInfo = styled.div`
  flex: 1;
  z-index: 1;
`;

const ModuleTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
  letter-spacing: -0.04em;
  
  @media (max-width: 576px) {
    font-size: 1.8rem;
  }
`;

const ModuleDescription = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ModuleProgressWrapper = styled.div`
  margin-top: 1.5rem;
  max-width: 400px;

  @media (max-width: 992px) {
    margin: 1.5rem auto 0;
  }

  .module-prog-label {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.secondaryText};
    margin-bottom: 0.75rem;
    display: flex;
    justify-content: space-between;
    font-weight: 600;

    strong {
      color: ${({ theme }) => theme.primary};
    }
  }

  .module-prog-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    overflow: hidden;

    div {
      height: 100%;
      background: ${({ $progress, theme }) =>
        $progress >= 100
          ? theme.success
          : theme.neonGradient || theme.primary};
      border-radius: 4px;
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 0 12px ${({ theme, $progress }) => 
        $progress >= 100 ? theme.success : theme.primary}44;
    }
  }
`;

const LessonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  animation: ${fadeInUp} 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const LessonCard = styled.div`
  background: ${({ theme }) => theme.glassBg || 'rgba(255, 255, 255, 0.03)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid ${({ theme, $completed }) => 
    $completed ? theme.success + '44' : theme.glassBorder || 'rgba(255, 255, 255, 0.05)'};
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: ${({ theme, $completed }) => $completed ? theme.success : theme.primary};
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3), 0 0 15px ${({ theme }) => theme.primary}22;

    .play-overlay {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    
    img {
      transform: scale(1.1);
    }
  }
`;

const LessonThumbnail = styled.div`
  height: 180px;
  position: relative;
  overflow: hidden;
  background: #000;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.7;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .play-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    background: ${({ theme }) => theme.primary};
    color: white;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2;
    box-shadow: 0 0 20px ${({ theme }) => theme.primary};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 40%;
    background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  }
`;

const LessonNumber = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 2;
`;

const LessonContent = styled.div`
  padding: 1.5rem;
  flex: 1;
`;

const LessonTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.text};
  line-height: 1.4;
`;

const LessonMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.secondaryText};
  font-weight: 600;
  
  span {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: ${({ theme, $completed }) => $completed ? theme.success : 'rgba(255,255,255,0.1)'};
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 2;
`;

const BackButton = styled(Button)`
  margin-bottom: 2rem;
  border-radius: 12px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
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
        
        const contentType = response.headers.get("content-type");
        let data = null;
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          throw new Error("A API não retornou um formato JSON válido.");
        }

        if (data) {
          data.lessons = [...(data.lessons || [])].sort((a, b) => a.order - b.order);
          setModule(data);
        } else {
          setModule(null);
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
    return <LoadingContainer>Sincronizando conteúdos...</LoadingContainer>;
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
    <div style={{ paddingBottom: '4rem' }}>
      <BackButton
        variant="outline"
        onClick={() => navigate('/modulos')}
      >
        ← Todos os Módulos
      </BackButton>

      <ModuleContainer>
        <ModuleHeader>
          <ModuleImage image={module.image} />
          <ModuleInfo>
            <ModuleTitle>{module.title}</ModuleTitle>
            <ModuleDescription>{module.description}</ModuleDescription>
            <ModuleProgressWrapper $progress={moduleProgress}>
              <div className="module-prog-label">
                <span>Progresso da Jornada</span>
                <strong>{moduleProgress}%</strong>
              </div>
              <div className="module-prog-bar">
                <div style={{ width: `${moduleProgress}%` }}></div>
              </div>
            </ModuleProgressWrapper>
          </ModuleInfo>
        </ModuleHeader>

        <LessonsGrid>
          {module.lessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.id);
            // Fallback thumbnail if not available
            const thumbUrl = lesson.thumbnail || `https://img.youtube.com/vi/${lesson.videoUrl?.split('/').pop()?.split('?')[0]}/maxresdefault.jpg`;
            
            return (
              <LessonCard
                key={lesson.id}
                onClick={() => handleLessonClick(lesson.id)}
                $completed={completed}
              >
                <LessonThumbnail>
                  <LessonNumber>{index + 1}</LessonNumber>
                  <StatusBadge $completed={completed}>
                    {completed ? 'Concluída' : 'Pendente'}
                  </StatusBadge>
                  <img src={thumbUrl} alt={lesson.title} />
                  <div className="play-overlay">
                    <FaPlayCircle />
                  </div>
                </LessonThumbnail>
                
                <LessonContent>
                  <LessonTitle>{lesson.title}</LessonTitle>
                  <LessonMeta>
                    <span>⏱ {lesson.duration || '15 min'}</span>
                    {lesson.audios?.length > 0 && (
                      <span>🔊 {lesson.audios.length}</span>
                    )}
                    {lesson.files?.length > 0 && (
                      <span>📄 {lesson.files.length}</span>
                    )}
                  </LessonMeta>
                </LessonContent>
              </LessonCard>
            );
          })}
        </LessonsGrid>
      </ModuleContainer>
    </div>
  );
}

export default ModuleDetail;