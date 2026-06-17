import { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;
import { FaPlay, FaPause, FaVolumeUp, FaVolumeDown, FaStepBackward, FaStepForward, FaPlus, FaList } from 'react-icons/fa';
import Button from '../ui/Button';
import { usePlaylist } from '../../context/PlaylistContext';

const AudioPlayerContainer = styled.div`
  background: ${({ theme }) => theme.glassBg || 'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.glassBorder || 'rgba(255, 255, 255, 0.1)'};
  box-shadow: ${({ theme }) => theme.glassGlow || '0 8px 32px rgba(0, 0, 0, 0.1)'};
  margin-bottom: 2.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary}33;
    box-shadow: ${({ theme }) => theme.glassGlow || '0 12px 48px rgba(0, 0, 0, 0.15)'};
  }

  @media (max-width: 576px) {
    padding: 1.5rem 1rem;
    border-radius: 16px;
  }
`;

const TranscriptContainer = styled.div`
  background: rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  color: ${({ theme }) => theme.text};
  font-size: 1.05rem;
  line-height: 1.7;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
`;

const AudioTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: ${({ theme }) => theme.accentGradient || theme.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const AudioDescription = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 0.95rem;
  margin: 0 0 2rem;
  opacity: 0.8;
  line-height: 1.5;
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 576px) {
    justify-content: center;
    gap: 0.5rem;
  }
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.primary};
  font-size: 1.4rem;
  cursor: pointer;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.primary}22;
    border-color: ${({ theme }) => theme.primary}44;
    transform: scale(1.1);
    color: ${({ theme }) => theme.primaryDark || theme.primary};
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 576px) {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
`;

const VolumeSlider = styled.input`
  width: 80px;
  margin: 0 0.5rem;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.primary};

  @media (max-width: 576px) {
    width: 60px;
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
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  margin-bottom: 0.75rem;
  overflow: hidden;

  @media (max-width: 576px) {
    height: 6px;
  }
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.secondaryText};
  font-variant-numeric: tabular-nums;
`;

const Progress = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.accentGradient || theme.primary};
  border-radius: 10px;
  width: ${({ $progress }) => (isNaN($progress) ? 0 : $progress)}%;
  transition: width 0.1s linear;
  box-shadow: 0 0 10px ${({ theme }) => (theme.primary || '#6366f1') + '44'};
`;

const TranscriptText = styled.span`
  color: ${({ $active, theme }) => $active ? theme.primary : theme.text};
  background: ${({ $active }) => $active ? 'rgba(99, 102, 241, 0.1)' : 'transparent'};
  padding: ${({ $active }) => $active ? '0.2rem 0.4rem' : '0'};
  border-radius: 4px;
  font-weight: ${({ $active }) => $active ? '700' : '400'};
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-block;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background: rgba(99, 102, 241, 0.05);
  }
`;

const AddMenuContainer = styled.div`
  position: relative;
  display: inline-flex;
  margin-left: auto;

  @media (max-width: 576px) {
    margin-left: 0.5rem;
  }
`;

const AddMenuDropdown = styled.div`
  position: absolute;
  bottom: 120%;
  right: 0;
  background: ${({ theme }) => theme.glassBg || 'rgba(30, 30, 45, 0.95)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.glassBorder || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.glassGlow || '0 8px 32px rgba(0, 0, 0, 0.3)'};
  padding: 0.75rem;
  min-width: 200px;
  z-index: 100;
  animation: ${fadeInUp} 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 576px) {
    right: -20px;
  }
`;

const AddMenuItem = styled.button`
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: ${({ theme }) => theme.primary};
    transform: translateX(4px);
  }

  &:disabled {
    cursor: default;
    opacity: 0.4;
    background: transparent;
    transform: none;
  }
`;

const AudioPlayer = ({ title, description, audioUrl, transcript, audioId, lessonTitle }) => {
  const { playlists, addTrack } = usePlaylist();
  const [showAddMenu, setShowAddMenu] = useState(false);
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

  const handleAddTrack = (playlistId) => {
    const trackData = { 
      audioId: audioId || `audio-${Date.now()}`, 
      title: title || 'Unknown Title', 
      fileUrl: audioUrl, 
      lessonTitle: lessonTitle || title || 'Unknown Lesson' 
    };
    addTrack(playlistId, trackData);
    setShowAddMenu(false);
  };

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

        <AddMenuContainer>
          <ControlButton 
            onClick={() => setShowAddMenu(!showAddMenu)} 
            title="Adicionar à Playlist"
            style={{ fontSize: '1.2rem' }}
          >
            <FaPlus />
          </ControlButton>
          {showAddMenu && playlists && (
            <AddMenuDropdown>
              {Object.values(playlists).length === 0 ? (
                <AddMenuItem disabled>Nenhuma playlist</AddMenuItem>
              ) : (
                Object.values(playlists).map(playlist => (
                  <AddMenuItem key={playlist.id} onClick={() => handleAddTrack(playlist.id)}>
                    <FaList size="0.8rem" />
                    {playlist.name}
                  </AddMenuItem>
                ))
              )}
            </AddMenuDropdown>
          )}
        </AddMenuContainer>
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

