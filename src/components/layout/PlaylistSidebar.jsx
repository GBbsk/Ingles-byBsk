import React, { useState } from 'react';
import styled from 'styled-components';
import { usePlaylist } from '../../context/PlaylistContext';
import { FaTimes, FaPlay, FaTrash } from 'react-icons/fa';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${({ isOpen }) => (isOpen ? '0' : '-350px')};
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
`;

const PlaylistSidebar = ({ isOpen, onClose }) => {
  const { playlists, playPlaylist, deletePlaylist, createPlaylist } = usePlaylist();
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
    }
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <HeaderRow>
        <h2>My Playlists</h2>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
      </HeaderRow>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input 
          value={newPlaylistName} 
          onChange={(e) => setNewPlaylistName(e.target.value)} 
          placeholder="New playlist name..."
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={handleCreate} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Create</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {Object.values(playlists).map(p => (
          <div key={p.id} style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{p.name}</strong>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>{p.tracks.length} tracks</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => playPlaylist(p.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#007bff' }}><FaPlay /></button>
              <button onClick={() => deletePlaylist(p.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#ff4444' }}><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </SidebarContainer>
  );
};

export default PlaylistSidebar;
