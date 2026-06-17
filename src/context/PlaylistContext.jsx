import React, { createContext, useState, useEffect, useContext } from 'react';

const PlaylistContext = createContext();

export const usePlaylist = () => useContext(PlaylistContext);

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('inglesbsk_playlists');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing playlists from local storage', e);
      }
    }
    return {};
  });
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Save to local storage whenever playlists change
  useEffect(() => {
    localStorage.setItem('inglesbsk_playlists', JSON.stringify(playlists));
  }, [playlists]);

  const createPlaylist = (name) => {
    const id = `playlist_${Date.now()}`;
    setPlaylists(prev => ({
      ...prev,
      [id]: { id, name, createdAt: new Date().toISOString(), tracks: [] }
    }));
    return id;
  };

  const addTrack = (playlistId, track) => {
    setPlaylists(prev => {
      const playlist = prev[playlistId];
      if (!playlist) return prev;
      return {
        ...prev,
        [playlistId]: {
          ...playlist,
          tracks: [...playlist.tracks, track]
        }
      };
    });
  };

  const removeTrack = (playlistId, trackIndex) => {
    const playlist = playlists[playlistId];
    if (!playlist) return;
    
    if (playlistId === currentPlaylistId) {
      if (trackIndex < currentTrackIndex) {
        setCurrentTrackIndex(prevIdx => prevIdx - 1);
      } else if (trackIndex === currentTrackIndex) {
        if (playlist.tracks.length <= 1) {
          setIsPlaying(false);
          setCurrentTrackIndex(0);
        } else if (currentTrackIndex >= playlist.tracks.length - 1) {
          setCurrentTrackIndex(playlist.tracks.length - 2);
          setIsPlaying(false);
        }
      }
    }

    setPlaylists(prev => {
      const p = prev[playlistId];
      if (!p) return prev;
      const newTracks = [...p.tracks];
      newTracks.splice(trackIndex, 1);
      return {
        ...prev,
        [playlistId]: {
          ...p,
          tracks: newTracks
        }
      };
    });
  };

  const reorderTracks = (playlistId, startIndex, endIndex) => {
    setPlaylists(prev => {
      const playlist = prev[playlistId];
      if (!playlist) return prev;
      
      const newTracks = Array.from(playlist.tracks);
      const [removed] = newTracks.splice(startIndex, 1);
      newTracks.splice(endIndex, 0, removed);

      // Update current track index if necessary
      if (playlistId === currentPlaylistId) {
        if (currentTrackIndex === startIndex) {
          setCurrentTrackIndex(endIndex);
        } else if (startIndex < currentTrackIndex && endIndex >= currentTrackIndex) {
          setCurrentTrackIndex(prevIdx => prevIdx - 1);
        } else if (startIndex > currentTrackIndex && endIndex <= currentTrackIndex) {
          setCurrentTrackIndex(prevIdx => prevIdx + 1);
        }
      }

      return {
        ...prev,
        [playlistId]: {
          ...playlist,
          tracks: newTracks
        }
      };
    });
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists(prev => {
      const newPlaylists = { ...prev };
      delete newPlaylists[playlistId];
      return newPlaylists;
    });
    if (currentPlaylistId === playlistId) {
      setCurrentPlaylistId(null);
      setIsPlaying(false);
    }
  };

  const playPlaylist = (playlistId, startIndex = 0) => {
    if (playlists[playlistId] && playlists[playlistId].tracks.length > 0) {
      setCurrentPlaylistId(playlistId);
      setCurrentTrackIndex(startIndex);
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    if (!currentPlaylistId || !playlists[currentPlaylistId]) return;
    const tracks = playlists[currentPlaylistId].tracks;
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const prevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setIsPlaying(true);
    }
  };

  const currentTrack = currentPlaylistId && playlists[currentPlaylistId] && currentTrackIndex < playlists[currentPlaylistId].tracks.length
    ? playlists[currentPlaylistId].tracks[currentTrackIndex] 
    : null;

  return (
    <PlaylistContext.Provider value={{
      playlists,
      createPlaylist,
      addTrack,
      removeTrack,
      reorderTracks,
      deletePlaylist,
      currentPlaylistId,
      currentTrackIndex,
      currentTrack,
      isPlaying,
      setIsPlaying,
      playPlaylist,
      nextTrack,
      prevTrack
    }}>
      {children}
    </PlaylistContext.Provider>
  );
};
