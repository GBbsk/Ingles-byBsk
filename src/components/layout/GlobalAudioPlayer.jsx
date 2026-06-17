import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePlaylist } from '../../context/PlaylistContext';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeDown } from 'react-icons/fa';

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.cardBg || '#fff'};
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  padding: 0.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  min-width: 150px;
`;

const Title = styled.strong`
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text || '#333'};
`;

const Subtitle = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.secondaryText || '#666'};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.primary || '#007bff'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s;
  &:disabled { color: #ccc; cursor: not-allowed; }
  &:hover:not(:disabled) { transform: scale(1.1); }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background-color: ${({ theme }) => theme.borderColor || '#eee'};
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  &:hover { height: 6px; }
`;

const Progress = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.primary || '#007bff'};
  border-radius: 2px;
  width: ${({ $progress }) => $progress}%;
`;

const Time = styled.span`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.secondaryText || '#666'};
  min-width: 35px;
`;

const VolumeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
  justify-content: flex-end;
  @media (max-width: 768px) { display: none; }
`;

const VolumeSlider = styled.input`
  width: 80px;
  cursor: pointer;
`;

const GlobalAudioPlayer = () => {
  const { currentTrack, isPlaying, setIsPlaying, nextTrack, prevTrack } = usePlaylist();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Autoplay prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pos * duration;
  };

  if (!currentTrack) return null;

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <PlayerContainer>
      <ProgressContainer>
        <Time>{formatTime(currentTime)}</Time>
        <ProgressBar ref={progressBarRef} onClick={handleProgressClick}>
          <Progress $progress={progressPercent} />
        </ProgressBar>
        <Time>{formatTime(duration)}</Time>
      </ProgressContainer>

      <MainContent>
        <TrackInfo>
          <Title title={currentTrack.title}>{currentTrack.title}</Title>
          <Subtitle>{currentTrack.lessonTitle}</Subtitle>
        </TrackInfo>
        
        <Controls>
          <ControlButton onClick={prevTrack} title="Previous"><FaStepBackward /></ControlButton>
          <ControlButton onClick={() => setIsPlaying(!isPlaying)} title={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <FaPause size="1.4rem" /> : <FaPlay size="1.4rem" />}
          </ControlButton>
          <ControlButton onClick={nextTrack} title="Next"><FaStepForward /></ControlButton>
        </Controls>

        <VolumeSection>
          {volume === 0 ? <FaVolumeDown /> : <FaVolumeUp />}
          <VolumeSlider 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))} 
          />
        </VolumeSection>
      </MainContent>

      <audio 
        ref={audioRef} 
        src={currentTrack.fileUrl} 
        onEnded={nextTrack}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        style={{ display: 'none' }}
      />
    </PlayerContainer>
  );
};

export default GlobalAudioPlayer;
