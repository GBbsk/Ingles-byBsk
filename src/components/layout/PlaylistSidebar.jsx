import React, { useState } from 'react';
import styled from 'styled-components';
import { usePlaylist } from '../../context/PlaylistContext';
import { FaTimes, FaPlay, FaTrash, FaChevronDown, FaChevronUp, FaArrowUp, FaArrowDown, FaMusic } from 'react-icons/fa';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1999;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${({ $isOpen }) => ($isOpen ? '0' : '-380px')};
  width: 380px;
  height: 100vh;
  background: ${({ theme }) => theme.glassBg || 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: ${({ theme }) => theme.glassGlow || '-8px 0 32px rgba(0,0,0,0.1)'};
  border-left: 1px solid ${({ theme }) => theme.glassBorder || 'rgba(255,255,255,0.1)'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2000;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text || '#333'};

  @media (max-width: 450px) {
    width: 100%;
    right: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
    border-left: none;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    background: ${({ theme }) => theme.accentGradient || theme.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(90deg);
  }
`;

const CreateRow = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.borderColor || 'rgba(255,255,255,0.1)'};
  background: rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.text || '#333'};
  font-size: 0.95rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary || '#6366f1'};
    background: rgba(0, 0, 0, 0.15);
    box-shadow: 0 0 0 3px ${({ theme }) => (theme.primary || '#6366f1') + '33'};
  }
`;

const CreateButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  cursor: pointer;
  background: ${({ theme }) => theme.button?.primaryBg || theme.primary || '#6366f1'};
  color: ${({ theme }) => theme.button?.primaryText || '#fff'};
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
    opacity: 0.95;
  }

  &:active {
    transform: translateY(0);
  }
`;

const PlaylistsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 0.5rem;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
`;

const PlaylistWrapper = styled.div`
  margin-bottom: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.08);
  }
`;

const PlaylistItem = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const PlaylistInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const PlaylistName = styled.strong`
  color: ${({ theme }) => theme.text || '#333'};
  font-size: 1rem;
  font-weight: 700;
`;

const TrackCount = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  background: ${({ theme }) => theme.accentGradient || '#6366f1'};
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
  min-width: 24px;
  text-align: center;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 10px;
  color: ${({ $color, theme }) => {
    if ($color === 'primary') return theme.primary || '#007bff';
    if ($color === 'error') return theme.error || '#ff4444';
    return theme.secondaryText || '#666';
  }};
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
  &:disabled { opacity: 0.2; cursor: not-allowed; transform: none; }
`;

const TracksList = styled.div`
  background: rgba(0, 0, 0, 0.1);
  max-height: ${({ $expanded }) => ($expanded ? '1000px' : '0')};
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const TrackItem = styled.div`
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  &:last-child { border-bottom: none; }

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const TrackTitle = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.text || '#333'};
  opacity: 0.9;
`;

const TrackActions = styled.div`
  display: flex;
  gap: 0.35rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: ${({ theme }) => theme.secondaryText || '#888'};
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-style: italic;

  svg {
    opacity: 0.3;
    font-size: 2rem;
  }
`;

const TrackEmpty = styled.div`
  padding: 1rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.secondaryText || '#888'};
  font-style: italic;
  text-align: center;
`;

const PlaylistSidebar = ({ isOpen, onClose }) => {
  const { 
    playlists, 
    playPlaylist, 
    deletePlaylist, 
    createPlaylist, 
    removeTrack, 
    reorderTracks 
  } = usePlaylist();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [expandedPlaylists, setExpandedPlaylists] = useState({});

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
    }
  };

  const toggleExpand = (id) => {
    setExpandedPlaylists(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleMove = (e, playlistId, index, direction) => {
    e.stopPropagation();
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    reorderTracks(playlistId, index, newIndex);
  };

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} aria-label="Close sidebar overlay" />
      <SidebarContainer $isOpen={isOpen} aria-hidden={!isOpen}>
        <HeaderRow>
          <h2>Minhas Playlists</h2>
          <CloseButton onClick={onClose} aria-label="Close sidebar"><FaTimes /></CloseButton>
        </HeaderRow>

        <CreateRow>
          <Input 
            value={newPlaylistName} 
            onChange={(e) => setNewPlaylistName(e.target.value)} 
            placeholder="Nome da playlist..."
            aria-label="New playlist name"
          />
          <CreateButton onClick={handleCreate}>Criar Playlist</CreateButton>
        </CreateRow>

        <PlaylistsContainer>
          {Object.values(playlists).length === 0 ? (
            <EmptyState>
              <FaMusic />
              Nenhuma playlist criada.
            </EmptyState>
          ) : (
            Object.values(playlists).map(p => (
              <PlaylistWrapper key={p.id}>
                <PlaylistItem onClick={() => toggleExpand(p.id)}>
                  <PlaylistInfo>
                    {expandedPlaylists[p.id] ? <FaChevronUp size="0.8rem" /> : <FaChevronDown size="0.8rem" />}
                    <PlaylistName>{p.name}</PlaylistName>
                    <TrackCount>{p.tracks.length}</TrackCount>
                  </PlaylistInfo>
                  <Actions>
                    <IconButton 
                      onClick={(e) => { e.stopPropagation(); playPlaylist(p.id); }} 
                      $color="primary"
                      title="Play Playlist"
                      disabled={p.tracks.length === 0}
                    >
                      <FaPlay />
                    </IconButton>
                    <IconButton 
                      onClick={(e) => { e.stopPropagation(); deletePlaylist(p.id); }} 
                      $color="error"
                      title="Delete Playlist"
                    >
                      <FaTrash />
                    </IconButton>
                  </Actions>
                </PlaylistItem>
                
                <TracksList $expanded={expandedPlaylists[p.id]}>
                  {p.tracks.map((track, idx) => (
                    <TrackItem key={`${track.audioId}-${idx}`}>
                      <TrackTitle title={track.title}>{track.title}</TrackTitle>
                      <TrackActions>
                        <IconButton 
                          onClick={(e) => handleMove(e, p.id, idx, 'up')}
                          disabled={idx === 0}
                          title="Move Up"
                        >
                          <FaArrowUp size="0.7rem" />
                        </IconButton>
                        <IconButton 
                          onClick={(e) => handleMove(e, p.id, idx, 'down')}
                          disabled={idx === p.tracks.length - 1}
                          title="Move Down"
                        >
                          <FaArrowDown size="0.7rem" />
                        </IconButton>
                        <IconButton 
                          onClick={(e) => { e.stopPropagation(); removeTrack(p.id, idx); }}
                          $color="error"
                          title="Remove Track"
                        >
                          <FaTrash size="0.7rem" />
                        </IconButton>
                      </TrackActions>
                    </TrackItem>
                  ))}
                  {p.tracks.length === 0 && (
                    <TrackEmpty>
                      Playlist vazia.
                    </TrackEmpty>
                  )}
                </TracksList>
              </PlaylistWrapper>
            ))
          )}
        </PlaylistsContainer>
      </SidebarContainer>
    </>
  );
};

export default PlaylistSidebar;
