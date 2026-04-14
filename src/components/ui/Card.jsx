import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const CardContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 14px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadowMd};
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: ${({ theme }) => theme.shadowXl};
    border-color: ${({ theme }) => theme.primary}33;
  }

  @media (max-width: 576px) {
    margin-bottom: 1rem;
    border-radius: 10px;
  }
`;

const CardImage = styled.div`
  height: 180px;
  background-image: url(${({ image }) => image});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
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
  
  @media (max-width: 576px) {
    padding: 1.25rem;
  }
`;

const CardTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primaryDark};

  @media (max-width: 576px) {
    font-size: 1.1rem;
  }
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 0.9rem;
  margin: 0 0 1rem;
  flex: 1;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const CardBadge = styled.span`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.button.primaryText};
  font-size: 0.8rem;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  font-weight: 600;
`;

// --- Progress Bar Netflix Style ---
const ProgressBarTrack = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: ${({ theme }) => theme.borderColor};
  z-index: 2;
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
      : theme.accentGradient};
  border-radius: 0 2px 2px 0;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${progressFillAnimation} 0.8s ease-out;
`;

const CompletedBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${({ theme }) => theme.success};
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  z-index: 3;
`;

const ProgressLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.secondaryText};
  font-weight: 500;
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
      {image && <CardImage image={image} />}
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {(badge || hasProgress) && (
          <CardFooter>
            {badge && <CardBadge>{badge}</CardBadge>}
            {hasProgress && (
              <ProgressLabel>
                {isComplete ? '✔ Concluído' : `${progress}%`}
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