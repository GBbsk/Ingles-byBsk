import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { FaCheckCircle, FaPlayCircle, FaChevronLeft, FaChevronRight, FaCheck } from 'react-icons/fa';
import Button from '../components/ui/Button';
import FileList from '../components/ui/FileList';
import AudioPlayer from '../components/layout/AudioPlayer';
import { useUserProgress } from '../hooks/useUserProgress';

// --- Animations ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const checkmarkPop = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
`;

// --- Styled Components ---
const PageWrapper = styled.div`
  padding: 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
  animation: ${fadeInUp} 0.5s ease-out;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const ResponsiveVideoWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  margin-bottom: 1.5rem;

  iframe, video {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    border-radius: 10px;
    border: none;
  }

  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

const TabsWrapper = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  gap: 1.5rem;
  font-size: 1rem;

  @media (max-width: 768px) {
    gap: 1rem;
    font-size: 0.9rem;
    overflow-x: auto;
    padding-bottom: 2px;
    margin-top: 0.5rem;
  }
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: ${({ theme, $active }) => $active ? theme.tabActiveText : theme.tabInactiveText};
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  padding: 0.75rem 0.25rem; 
  margin-bottom: -1px; 
  border-bottom: 3px solid ${({ theme, $active }) => $active ? theme.tabBorder : 'transparent'};
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  white-space: nowrap; 

  &:hover {
    color: ${({ theme }) => theme.primaryDark};
  }

  @media (max-width: 600px) {
    padding: 0.6rem 0.5rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.secondaryText};
`;

const AudioListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 1.2rem;
`;

const AudioCard = styled.div`
  background: ${({ theme }) => theme.audioCard?.backgroundGradient || 'linear-gradient(120deg, #e0e7ff 0%, #f0fdfa 100%)'};
  border-radius: 14px;
  padding: 1.1rem 1.3rem;
  box-shadow: ${({ theme }) => theme.audioCard?.boxShadow || '0 4px 16px rgba(80, 112, 255, 0.08)'};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-left: 6px solid ${({ theme }) => theme.audioCard?.borderLeft || '#4f46e5'};
  transition: box-shadow 0.2s, border 0.2s;
  width: 100%;

  @media (max-width: 600px) {
    padding: 0.8rem 0.6rem;
    border-left-width: 4px;
  }

  &:hover {
    box-shadow: ${({ theme }) => theme.audioCard?.hoverBoxShadow || '0 8px 24px rgba(80, 112, 255, 0.13)'};
    border-left-color: ${({ theme }) => theme.audioCard?.hoverBorderLeft || '#06b6d4'};
  }
`;

const AudioTitle = styled.div`
  font-weight: 700;
  font-size: 1.08rem;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.audioCard?.titleColor || theme.primary};
  letter-spacing: 0.01em;
`;

const AudioDescription = styled.div`
  font-size: 0.97rem;
  color: ${({ theme }) => theme.audioCard?.descriptionColor || theme.secondaryText};
  margin-bottom: 0.5rem;
`;

const ModuleReturnButton = styled(Button)`
  margin-bottom: 1.5rem;
  display: block;
  width: fit-content;

  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

const ToggleLayoutButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem 0.5rem;
  display: none;

  @media (min-width: 993px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`;

// --- Mark Complete Button ---
const CompleteButtonWrapper = styled.div`
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: ${fadeInUp} 0.5s ease-out 0.2s both;
`;

const MarkCompleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid;

  ${({ $completed, theme }) =>
    $completed
      ? `
    background: ${theme.success};
    border-color: ${theme.success};
    color: white;
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
    
    &:hover {
      background: transparent;
      color: ${theme.success};
    }
  `
      : `
    background: transparent;
    border-color: ${theme.primary};
    color: ${theme.primary};

    &:hover {
      background: ${theme.primary};
      color: white;
      box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
      transform: translateY(-1px);
    }
  `}

  svg {
    font-size: 1.1rem;
    ${({ $completed }) => $completed && css`animation: ${checkmarkPop} 0.4s ease-out;`}
  }

  @media (max-width: 576px) {
    width: 100%;
    justify-content: center;
    padding: 0.8rem 1rem;
  }
`;

const CompletionLabel = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.secondaryText};
`;

// --- Layout Components ---
const ContentLayout = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-direction: row;

  ${({ $isWideLayout }) =>
    $isWideLayout &&
    `
    @media (min-width: 993px) {
      flex-direction: column;
    }
  `}

  @media (max-width: 992px) { 
    flex-direction: column;
  }
`;

const MainContentColumn = styled.div`
  flex: 3;
  min-width: 0; 

  ${({ $isWideLayout }) =>
    $isWideLayout &&
    `
    @media (min-width: 993px) {
      flex-grow: 1;
      flex-basis: 100%;
    }
  `}
`;

const SidebarColumn = styled.div`
  flex: 1;
  min-width: 0; 
  
   ${({ $isWideLayout }) =>
    $isWideLayout &&
    `
    @media (min-width: 993px) {
      flex-grow: 1;
      flex-basis: 100%;
      margin-top: 2rem; 
    }
  `}
  
  @media (max-width: 992px) {
    margin-top: 2rem; 
  }
`;

const LessonHeaderDetails = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.cardBorder};

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem; 
    margin-bottom: 0.5rem;
  }
`;

const BreadcrumbsPath = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.secondaryText};
  margin-bottom: 0.5rem;

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      font-size: 0.7rem;
      margin-bottom: 0.15rem;
    }
  }
`;

const LessonTitleStyled = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.text};

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 0.25rem;
  }
`;

const LessonProgressStatus = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.secondaryText};
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .lesson-view-status {
    color: ${({ theme }) => theme.success};
    font-weight: 500;
  }

  .module-progress-bar {
    height: 6px;
    background-color: ${({ theme }) => theme.borderColor};
    border-radius: 3px;
    overflow: hidden;
    margin-top: 0.15rem;
    
    div {
      height: 100%;
      background-color: ${({ theme }) => theme.primary};
      border-radius: 3px;
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
    margin-bottom: 0.25rem;
    gap: 0.15rem;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const NextLessonsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ModuleLessonItem = styled.li`
  margin-bottom: 0.75rem;

  a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 6px;
    text-decoration: none;
    color: ${({ theme, $active, $completed }) => $active ? theme.primary : ($completed ? theme.text : theme.secondaryText)};
    background-color: ${({ theme, $active }) => $active ? theme.primaryLight : 'transparent'};
    font-weight: ${({ $active }) => $active ? '600' : '400'};
    transition: background-color 0.2s, color 0.2s;

    @media (max-width: 768px) {
      font-size: 0.9rem;
      padding: 0.6rem;
      gap: 0.5rem;
    }

    &:hover {
      background-color: ${({ theme }) => theme.primaryLight};
      color: ${({ theme }) => theme.primary};
    }

    .play-icon {
      color: ${({ theme }) => theme.primary};
    }
    
    svg { 
      font-size: 1.1rem;
      color: ${({ theme, $completed, $active }) => $active ? theme.primary : ($completed ? theme.success : theme.secondaryText)};
      opacity: ${({ $completed, $active }) => $active ? 1 : ($completed ? 1 : 0.5)};
      
      @media (max-width: 768px) {
        font-size: 1rem;
      }
    }
  }
`;

const ModuleNavigationLinks = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  justify-content: space-between;

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;


function LessonDetail() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('downloads');
  const [isWideLayout, setIsWideLayout] = useState(false);

  const {
    isLessonCompleted,
    toggleLessonCompleted,
    setLastWatched,
    getModuleProgress,
  } = useUserProgress();

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/modules/${moduleId}`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar módulo: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        let foundModule = null;
        if (contentType && contentType.includes("application/json")) {
          foundModule = await response.json();
        } else {
          throw new Error("A API não retornou um formato JSON válido.");
        }

        if (foundModule) {
          const enrichedModule = {
            ...foundModule,
            lessons: Array.isArray(foundModule.lessons) ? foundModule.lessons : [],
          };
          setModule(enrichedModule);

          const lessonIndex = enrichedModule.lessons.findIndex(l => l.id === parseInt(lessonId));

          if (lessonIndex !== -1) {
            const currentLesson = enrichedModule.lessons[lessonIndex];
            setLesson(currentLesson);

            // Registrar "Continue Assistindo"
            setLastWatched(currentLesson.id, enrichedModule.id);

            // Definir aba ativa com base no conteúdo disponível
            if (currentLesson.files && currentLesson.files.length > 0) {
              setActiveTab('downloads');
            } else if (currentLesson.audios && currentLesson.audios.length > 0) {
              setActiveTab('audios');
            } else if (currentLesson.textStudyContent) {
              setActiveTab('textStudy');
            }

          } else {
            setLesson(null);
          }
        } else {
          setModule(null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar a aula:', error);
        setLoading(false);
      }
    };

    fetchLesson();
  }, [moduleId, lessonId, setLastWatched]);

  if (loading) {
    return <LoadingContainer>Carregando aula...</LoadingContainer>;
  }

  if (!module || !lesson) {
    return (
      <PageWrapper>
        <ModuleReturnButton variant="outline" onClick={() => navigate(`/modulos/${moduleId || ''}`)}>
          ← Voltar para o Módulo
        </ModuleReturnButton>
        <p>Aula ou módulo não encontrado.</p>
      </PageWrapper>
    );
  }

  const currentLessonOrder = module.lessons.findIndex(l => l.id === lesson.id) + 1;
  const lessonCompleted = isLessonCompleted(lesson.id);
  const moduleProgress = getModuleProgress(module.id, module.lessons);

  return (
    <PageWrapper>
      <ModuleReturnButton variant="outline" onClick={() => navigate(`/modulos/${module.id}`)}>
        ← Voltar para o Módulo
      </ModuleReturnButton>

      <ContentLayout $isWideLayout={isWideLayout}>
        <MainContentColumn $isWideLayout={isWideLayout}>
          <ResponsiveVideoWrapper>
            <iframe
              src={lesson.videoUrl}
              title={lesson.title}
              allowFullScreen
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-presentation"
            />
          </ResponsiveVideoWrapper>

          <LessonHeaderDetails>
            <BreadcrumbsPath>
              <Link to={`/modulos`}>{module.stageName || `Etapa ${module.stageOrder}`}</Link>
              {' > '}
              <Link to={`/modulos/${module.id}`}>{module.title}</Link>
            </BreadcrumbsPath>
            <LessonTitleStyled>{lesson.title}</LessonTitleStyled>
            <LessonProgressStatus>
              <span>
                Aula {currentLessonOrder}/{module.lessons.length}
                {lessonCompleted && <span className="lesson-view-status"> | ✔ Concluída</span>}
              </span>
              <span>
                Módulo: {moduleProgress}% concluído
                <span className="module-progress-bar"><div style={{ width: `${moduleProgress}%` }}></div></span>
              </span>
            </LessonProgressStatus>
          </LessonHeaderDetails>

          {/* Botão de Marcar como Concluída */}
          <CompleteButtonWrapper>
            <MarkCompleteButton
              $completed={lessonCompleted}
              onClick={() => toggleLessonCompleted(lesson.id, module.id)}
            >
              {lessonCompleted ? <FaCheck /> : <FaCheckCircle />}
              {lessonCompleted ? 'Aula Concluída' : 'Marcar Aula como Concluída'}
            </MarkCompleteButton>
            {lessonCompleted && (
              <CompletionLabel>Clique novamente para desmarcar</CompletionLabel>
            )}
          </CompleteButtonWrapper>

          <TabsWrapper>
            <Tab $active={activeTab === 'downloads'} onClick={() => setActiveTab('downloads')}>Downloads</Tab>
            <Tab $active={activeTab === 'audios'} onClick={() => setActiveTab('audios')}>Áudios</Tab>
            <Tab $active={activeTab === 'textStudy'} onClick={() => setActiveTab('textStudy')}>Estudo do Texto</Tab>
          </TabsWrapper>

          {activeTab === 'downloads' && (
            lesson.files && lesson.files.length > 0
              ? <FileList files={lesson.files} />
              : <p>Nenhum download disponível para esta aula.</p>
          )}
          {activeTab === 'audios' && (
            lesson.audios && lesson.audios.length > 0 ? (
              <AudioListWrapper>
                {lesson.audios.map(audio => (
                  <AudioCard key={audio.id}>
                    <AudioTitle>{audio.title}</AudioTitle>
                    {audio.description && <AudioDescription>{audio.description}</AudioDescription>}
                    <AudioPlayer title={audio.title} description={audio.description} audioUrl={audio.fileUrl} transcript={audio.transcript} />
                  </AudioCard>
                ))}
              </AudioListWrapper>
            ) : <p>Nenhum áudio disponível para esta aula.</p>
          )}
          {activeTab === 'textStudy' && (
            lesson.textStudyContent
              ? <div>{lesson.textStudyContent}</div>
              : <p>Nenhum estudo de texto disponível para esta aula.</p>
          )}
        </MainContentColumn>

        <SidebarColumn $isWideLayout={isWideLayout}>
          <SidebarHeader>
            <SidebarTitle>Aulas - {module.title}</SidebarTitle>
            <ToggleLayoutButton onClick={() => setIsWideLayout(prev => !prev)}>
              {isWideLayout ? <FaChevronRight /> : <FaChevronLeft />}
            </ToggleLayoutButton>
          </SidebarHeader>
          {module.lessons && module.lessons.length > 0 ? (
            <NextLessonsList>
              {module.lessons.map(l => (
                <ModuleLessonItem key={l.id} $active={l.id === lesson.id} $completed={isLessonCompleted(l.id)}>
                  <Link to={`/modulos/${module.id}/aula/${l.id}`}>
                    {l.id === lesson.id
                      ? <FaPlayCircle className="play-icon" />
                      : (isLessonCompleted(l.id) ? <FaCheckCircle /> : <FaCheckCircle style={{ opacity: 0.3 }} />)
                    }
                    {l.title}
                  </Link>
                </ModuleLessonItem>
              ))}
            </NextLessonsList>
          ) : (
            <p>Nenhuma aula encontrada neste módulo.</p>
          )}
          {(module.prevModuleId || module.nextModuleId) && (
            <ModuleNavigationLinks>
              {module.prevModuleId ? (
                <Link to={`/modulos/${module.prevModuleId}`}>&larr; Módulo Anterior</Link>
              ) : <span></span>}
              {module.nextModuleId ? (
                <Link to={`/modulos/${module.nextModuleId}`}>Próximo Módulo &rarr;</Link>
              ) : <span></span>}
            </ModuleNavigationLinks>
          )}
        </SidebarColumn>
      </ContentLayout>
    </PageWrapper>
  );
}

export default LessonDetail;
