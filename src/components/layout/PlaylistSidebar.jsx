import React, { useState } from 'react';
import styled from 'styled-components';
import { usePlaylist } from '../../context/PlaylistContext';
import { FaTimes, FaPlay, FaTrash, FaChevronDown, FaChevronUp, FaArrowUp, FaArrowDown } from 'react-icons/fa';

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
  right: ${({ $isOpen }) => ($isOpen ? '0' : '-350px')};
  width: 350px;
  height: 100vh;
  background-color: ${({ theme }) => theme.cardBg || '#fff'};
  box-shadow: -2px 0 10px rgba(0,0,0,0.1);
  transition: right 0.3s ease;
  z-index: 2000;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text || '#333'};

  @media (max-width: 400px) {
    width: 100%;
    right: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
`;

const CreateRow = styled.div`
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.borderColor || '#ccc'};
  background-color: ${({ theme }) => theme.body || '#f7f8fc'};
  color: ${({ theme }) => theme.text || '#333'};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary || '#6366f1'};
  }
`;

const CreateButton = styled.button`
  padding: 0.5rem 1rem;
  cursor: pointer;
  background: ${({ theme }) => theme.button?.primaryBg || theme.primary || '#6366f1'};
  color: ${({ theme }) => theme.button?.primaryText || '#fff'};
  border: none;
  border-radius: 4px;
  font-weight: bold;
  &:hover {
    opacity: 0.9;
  }
`;

const PlaylistsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 0.5rem;
`;

const PlaylistWrapper = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.borderColor || '#eee'};
`;

const PlaylistItem = styled.div`
  padding: 0.75rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover { background-color: ${({ theme }) => theme.primaryLight || 'rgba(0,0,0,0.02)'}; }
`;

const PlaylistInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const PlaylistName = styled.strong`
  color: ${({ theme }) => theme.text || '#333'};
  font-size: 0.95rem;
`;

const TrackCount = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.secondaryText || '#666'};
  background-color: ${({ theme }) => theme.borderColor || '#eee'};
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const IconButton = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border-radius: 4px;
  color: ${({ $color, theme }) => {
    if ($color === 'primary') return theme.primary || '#007bff';
    if ($color === 'error') return theme.error || '#ff4444';
    return theme.secondaryText || '#666';
  }};

  &:hover {
    background-color: ${({ theme }) => theme.primaryLight || 'rgba(0,0,0,0.05)'};
  }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;

const TracksList = styled.div`
  background-color: ${({ theme }) => theme.body || '#f9f9f9'};
  padding-left: 1rem;
  max-height: ${({ $expanded }) => ($expanded ? '1000px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const TrackItem = styled.div`
  padding: 0.6rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor || '#eee'};
  &:last-child { border-bottom: none; }
`;

const TrackTitle = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 0.5rem;
`;

const TrackActions = styled.div`
  display: flex;
  gap: 0.2rem;
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
          <CreateButton onClick={handleCreate}>Criar</CreateButton>
        </CreateRow>

        <PlaylistsContainer>
          {Object.values(playlists).length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '2rem', color: '#888' }}>
              Nenhuma playlist criada.
            </div>
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
                    <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#888', fontStyle: 'italic' }}>
                      Playlist vazia.
                    </div>
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
