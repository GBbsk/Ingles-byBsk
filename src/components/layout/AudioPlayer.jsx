import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeDown, FaStepBackward, FaStepForward } from 'react-icons/fa';
import Button from '../ui/Button';

const AudioPlayerContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); /* Idealmente, a sombra também viria do tema */
  margin-bottom: 2rem;

  @media (max-width: 576px) {
    padding: 1rem 0.5rem;
  }
`;

const TranscriptContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 10px;
  padding: 1rem 1.2rem;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(80, 112, 255, 0.07);
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  line-height: 1.6;
  max-height: 260px;
  overflow-y: auto;
`;

const AudioTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const AudioDescription = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 0.9rem;
  margin: 0 0 1.5rem;
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  @media (max-width: 576px) {
    flex-direction: row;
    justify-content: center;
    gap: 0.3rem;
    margin-bottom: 0.7rem;
  }
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50%;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.primaryLight};
  }

  @media (max-width: 576px) {
    font-size: 1.2rem;
    padding: 0.2rem;
  }
`;

const VolumeSlider = styled.input`
  width: 70px;
  margin: 0 0.3rem;

  @media (max-width: 576px) {
    width: 50px;
  }
`;

const ProgressContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${({ theme }) => theme.borderColor};
  border-radius: 3px;
  position: relative;
  cursor: pointer;
  margin-bottom: 0.5rem;

  @media (max-width: 576px) {
    height: 5px;
    margin-bottom: 0.3rem;
  }
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.secondaryText};

  @media (max-width: 576px) {
    font-size: 0.7rem;
  }
`;

// Use $progress as a transient prop
const Progress = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 3px;
  width: ${({ $progress }) => (isNaN($progress) ? 0 : $progress)}%;
  transition: width 0.1s linear;
`;

// Use $active as a transient prop
const TranscriptText = styled.span`
  color: ${({ $active, theme }) => $active ? theme.primary : theme.text};
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  transition: color 0.3s ease, font-weight 0.3s ease;
  cursor: pointer;
`;


const AudioPlayer = ({ title, description, audioUrl, transcript }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTextIndex, setActiveTextIndex] = useState(null);
  const [volume, setVolume] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Atualiza o estado de isPlaying baseado no evento real do áudio
  useEffect(() => {
    const audio = audioRef.current;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);

      if (transcript && transcript.length > 0) {
        for (let i = 0; i < transcript.length; i++) {
          const current = transcript[i];
          const next = transcript[i + 1];

          if (
            audio.currentTime >= current.time && 
            (!next || audio.currentTime < next.time)
          ) {
            setActiveTextIndex(i);
            break;
          }
        }
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [transcript]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!audioUrl || !audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
    // Não altere isPlaying aqui, deixe os eventos cuidarem disso
  };

  const handleProgressChange = (e) => {
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleTranscriptClick = (index) => {
    if (transcript && transcript[index]) {
      const time = transcript[index].time;
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      setActiveTextIndex(index);

      if (audioRef.current.paused) {
        audioRef.current.play();
      }
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(Number(e.target.value));
  };

  const skipTime = (amount) => {
    if (audioRef.current) {
      let newTime = audioRef.current.currentTime + amount;
      if (newTime < 0) newTime = 0;
      if (newTime > duration) newTime = duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <AudioPlayerContainer>
      <AudioTitle>{title}</AudioTitle>
      <AudioDescription>{description}</AudioDescription>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <PlayerControls>
        <ControlButton onClick={() => skipTime(-10)} title="Voltar 10s">
          <FaStepBackward />
        </ControlButton>
        <ControlButton onClick={togglePlay} disabled={!audioUrl} title={isPlaying ? "Pausar" : "Reproduzir"}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </ControlButton>
        <ControlButton onClick={() => skipTime(10)} title="Avançar 10s">
          <FaStepForward />
        </ControlButton>
        <FaVolumeDown style={{ marginLeft: '1rem', marginRight: '0.2rem' }} />
        <VolumeSlider
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
        />
        <FaVolumeUp style={{ marginLeft: '0.2rem' }} />
      </PlayerControls>

      <ProgressContainer>
        <ProgressBar 
          ref={progressBarRef} 
          onClick={handleProgressChange}
        >
          <Progress $progress={duration > 0 ? (currentTime / duration) * 100 : 0} />
        </ProgressBar>
        <TimeDisplay>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </TimeDisplay>
      </ProgressContainer>

      {transcript && transcript.length > 0 && (
        <>
          <Button
            variant="outline"
            size="small"
            style={{ margin: '0.5rem 0' }}
            onClick={() => setShowTranscript((prev) => !prev)}
          >
            {showTranscript ? 'Ocultar Transcrição' : 'Mostrar Transcrição'}
          </Button>
          {showTranscript && (
            <TranscriptContainer>
              {transcript.map((item, index) => (
                <TranscriptText
                  key={index}
                  $active={activeTextIndex === index}
                  onClick={() => handleTranscriptClick(index)}
                >
                  {item.text}{' '}
                </TranscriptText>
              ))}
            </TranscriptContainer>
          )}
        </>
      )}
    </AudioPlayerContainer>
  );
};

export default AudioPlayer

