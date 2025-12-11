import Playlist from '../models/Playlist.js';
import Song from '../models/Song.js';

class PlaylistService {
  /**
   * Create a new playlist
   */
  async createPlaylist(userId, playlistData) {
    console.log('📝 Creating playlist with userId:', userId);
    console.log('📝 Playlist data:', playlistData);
    
    const playlist = new Playlist({
      ...playlistData,
      userId,
      songs: [],
    });

    await playlist.save();
    console.log('✅ Playlist created:', playlist._id, 'for user:', playlist.userId);
    return playlist;
  }

  /**
   * Get user's playlists
   */
  async getUserPlaylists(userId) {
    const playlists = await Playlist.find({ userId })
      .populate('songs', 'title artist album image duration')
      .sort({ createdAt: -1 });

    return playlists;
  }

  /**
   * Get playlist by ID
   */
  async getPlaylistById(playlistId, userId) {
    const playlist = await Playlist.findOne({ _id: playlistId, userId })
      .populate('songs', 'title artist album image duration');

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    return playlist;
  }

  /**
   * Update playlist info (name, description, image)
   */
  async updatePlaylistInfo(playlistId, userId, updateData) {
    const playlist = await Playlist.findOne({ _id: playlistId, userId });

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    // Update allowed fields
    if (updateData.name !== undefined) playlist.name = updateData.name;
    if (updateData.description !== undefined) playlist.description = updateData.description;
    if (updateData.image !== undefined) playlist.image = updateData.image;
    if (updateData.isPublic !== undefined) playlist.isPublic = updateData.isPublic;

    await playlist.save();
    return playlist;
  }

  /**
   * Add song to playlist
   */
  async addSongToPlaylist(playlistId, userId, songId) {
    console.log('🎵 addSongToPlaylist called with:', { playlistId, userId, songId });
    
    const playlist = await Playlist.findOne({ _id: playlistId, userId });
    console.log('📋 Found playlist:', playlist ? playlist._id : 'NOT FOUND');

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    // Check if song exists
    const song = await Song.findById(songId);
    console.log('🎵 Found song:', song ? song._id : 'NOT FOUND');
    
    if (!song) {
      throw new Error('Song not found');
    }

    // Check if song already in playlist
    if (playlist.songs.includes(songId)) {
      throw new Error('Song already in playlist');
    }

    // Add song
    console.log('➕ Adding song to playlist...');
    playlist.songs.push(songId);
    
    // Update total duration
    // Convert duration to seconds if it's a string (mm:ss format)
    let durationInSeconds = 0;
    if (song.duration) {
      if (typeof song.duration === 'string') {
        // Parse "mm:ss" format to seconds
        const parts = song.duration.split(':');
        if (parts.length === 2) {
          durationInSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else {
          durationInSeconds = parseInt(song.duration) || 0;
        }
      } else {
        durationInSeconds = song.duration;
      }
    }
    
    console.log('Duration conversion:', song.duration, '→', durationInSeconds, 'seconds');
    playlist.totalDuration += durationInSeconds;

    console.log('💾 Saving playlist...');
    console.log('Playlist data before save:', {
      _id: playlist._id,
      userId: playlist.userId,
      name: playlist.name,
      songsCount: playlist.songs.length,
      totalDuration: playlist.totalDuration
    });
    
    await playlist.save();
    console.log('✅ Playlist saved successfully');
    
    // Return populated playlist
    return await Playlist.findById(playlistId)
      .populate('songs', 'title artist album image duration');
  }

  /**
   * Remove song from playlist
   */
  async removeSongFromPlaylist(playlistId, userId, songId) {
    const playlist = await Playlist.findOne({ _id: playlistId, userId });

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    // Get song for duration
    const song = await Song.findById(songId);

    // Remove song
    playlist.songs = playlist.songs.filter(id => id.toString() !== songId.toString());
    
    // Update total duration
    if (song && song.duration) {
      let durationInSeconds = 0;
      if (typeof song.duration === 'string') {
        // Parse "mm:ss" format to seconds
        const parts = song.duration.split(':');
        if (parts.length === 2) {
          durationInSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else {
          durationInSeconds = parseInt(song.duration) || 0;
        }
      } else {
        durationInSeconds = song.duration;
      }
      
      playlist.totalDuration -= durationInSeconds;
      if (playlist.totalDuration < 0) playlist.totalDuration = 0;
    }

    await playlist.save();
    
    // Return populated playlist
    return await Playlist.findById(playlistId)
      .populate('songs', 'title artist album image duration');
  }

  /**
   * Delete playlist
   */
  async deletePlaylist(playlistId, userId) {
    const playlist = await Playlist.findOneAndDelete({ _id: playlistId, userId });

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    return playlist;
  }
}

export default new PlaylistService();
