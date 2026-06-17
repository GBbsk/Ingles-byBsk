import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const CardContainer = styled.div`
  background: ${({ theme }) => theme.glassBg || theme.cardBg};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.glassBorder || theme.cardBorder};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.glassGlow || theme.shadowMd};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: ${({ theme }) => theme.glassBorderNeon || theme.primary};
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3), 0 0 20px ${({ theme }) => theme.primary}22;
    
    .card-image-bg {
      transform: scale(1.08);
    }
  }

  @media (max-width: 576px) {
    border-radius: 12px;
  }
`;

const CardImage = styled.div`
  height: 180px;
  position: relative;
  overflow: hidden;
  
  .card-image-bg {
    width: 100%;
    height: 100%;
    background-image: url(${({ image }) => image});
    background-size: cover;
    background-position: center;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(to top, rgba(15, 15, 26, 0.8), transparent);
    z-index: 1;
  }
  
  @media (max-width: 576px) {
    height: 160px;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  z-index: 2;
  
  @media (max-width: 576px) {
    padding: 1.25rem;
  }
`;

const CardTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  letter-spacing: -0.02em;

  @media (max-width: 576px) {
    font-size: 1.1rem;
  }
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 0.9rem;
  margin: 0 0 1.25rem;
  flex: 1;
  line-height: 1.5;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const CardBadge = styled.span`
  background: ${({ theme }) => theme.primaryLight || theme.primary};
  color: ${({ theme }) => theme.primary};
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-weight: 600;
  border: 1px solid ${({ theme }) => theme.primary}33;
`;

// --- Progress Bar Cyber Glass Style ---
const ProgressBarTrack = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  z-index: 5;
`;

const progressFillAnimation = keyframes`
  from { width: 0%; }
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: ${({ $progress, theme }) => 
    $progress >= 100 
      ? theme.success 
      : theme.neonGradient || theme.primary};
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${progressFillAnimation} 1s ease-out;
  box-shadow: 0 0 10px ${({ theme, $progress }) => 
    $progress >= 100 ? theme.success : theme.primary}66;
`;

const CompletedBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${({ theme }) => theme.success};
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  z-index: 10;
  border: 2px solid ${({ theme }) => theme.body};
`;

const ProgressLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.secondaryText};
  font-weight: 600;
`;

const Card = ({ 
  id, 
  title, 
  description, 
  image, 
  badge, 
  progress, // 0 a 100, opcional
  onClick, 
  linkTo,
  ...props 
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (linkTo) {
      navigate(linkTo);
    }
  };
  
  const hasProgress = typeof progress === 'number' && progress > 0;
  const isComplete = progress >= 100;
  
  return (
    <CardContainer onClick={handleClick} {...props}>
      {isComplete && (
        <CompletedBadge title="Módulo Concluído">
          <FaCheckCircle />
        </CompletedBadge>
      )}
      {image && (
        <CardImage image={image}>
          <div className="card-image-bg" />
        </CardImage>
      )}
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {(badge || hasProgress) && (
          <CardFooter>
            {badge && <CardBadge>{badge}</CardBadge>}
            {hasProgress && (
              <ProgressLabel>
                {isComplete ? '✔ Concluído' : `${Math.round(progress)}%`}
              </ProgressLabel>
            )}
          </CardFooter>
        )}
      </CardContent>
      {hasProgress && (
        <ProgressBarTrack>
          <ProgressBarFill $progress={progress} />
        </ProgressBarTrack>
      )}
    </CardContainer>
  );
};

export default Card;