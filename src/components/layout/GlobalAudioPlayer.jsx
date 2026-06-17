import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { usePlaylist } from '../../context/PlaylistContext';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.cardBg || '#fff'};
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 300px;
`;

const Title = styled.strong`
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text || '#333'};
`;

const Subtitle = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.secondaryText || '#666'};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.primary || '#007bff'};
  display: flex;
  align-items: center;
  justify-content: center;
  &:disabled { color: #ccc; cursor: not-allowed; }
`;

const GlobalAudioPlayer = () => {
  const { currentTrack, isPlaying, setIsPlaying, nextTrack, prevTrack } = usePlaylist();
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Autoplay prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  if (!currentTrack) return null;

  return (
    <PlayerContainer>
      <TrackInfo>
        <Title>{currentTrack.title}</Title>
        <Subtitle>{currentTrack.lessonTitle}</Subtitle>
      </TrackInfo>
      
      <Controls>
        <ControlButton onClick={prevTrack}><FaStepBackward /></ControlButton>
        <ControlButton onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </ControlButton>
        <ControlButton onClick={nextTrack}><FaStepForward /></ControlButton>
      </Controls>

      <audio 
        ref={audioRef} 
        src={currentTrack.fileUrl} 
        onEnded={nextTrack}
        style={{ display: 'none' }}
      />
    </PlayerContainer>
  );
};

export default GlobalAudioPlayer;
