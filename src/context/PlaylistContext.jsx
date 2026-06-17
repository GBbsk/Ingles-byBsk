import React, { createContext, useState, useEffect, useContext } from 'react';

const PlaylistContext = createContext();

export const usePlaylist = () => useContext(PlaylistContext);

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState({});
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('inglesbsk_playlists');
    if (saved) {
      try {
        setPlaylists(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing playlists from local storage', e);
      }
    }
  }, []);

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
    setPlaylists(prev => {
      const playlist = prev[playlistId];
      if (!playlist) return prev;
      const newTracks = [...playlist.tracks];
      newTracks.splice(trackIndex, 1);
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

  const currentTrack = currentPlaylistId && playlists[currentPlaylistId] 
    ? playlists[currentPlaylistId].tracks[currentTrackIndex] 
    : null;

  return (
    <PlaylistContext.Provider value={{
      playlists,
      createPlaylist,
      addTrack,
      removeTrack,
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
