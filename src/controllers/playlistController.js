import playlistService from '../services/playlistService.js';

class PlaylistController {
  getRequestUserId(req) {
    return (
      req.user?._id ||
      req.headers['x-user-id'] ||
      req.query.userId ||
      req.body?.userId ||
      null
    );
  }

  requireUserId(req, res) {
    const userId = this.getRequestUserId(req);
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Missing userId',
      });
      return null;
    }
    return userId;
  }

  // POST /api/playlists - Create new playlist
  async createPlaylist(req, res, next) {
    try {
      const userId = this.requireUserId(req, res);
      if (!userId) return;
      const { name, description, image, isPublic } = req.body;

      const playlist = await playlistService.createPlaylist(userId, {
        name,
        description,
        image,
        isPublic,
      });

      res.status(201).json({
        success: true,
        data: playlist,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/playlists - Get user's playlists
  async getUserPlaylists(req, res, next) {
    try {
      const userId = this.requireUserId(req, res);
      if (!userId) return;

      const playlists = await playlistService.getUserPlaylists(userId);

      res.status(200).json({
        success: true,
        data: playlists,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/playlists/:id - Get playlist by ID
  async getPlaylistById(req, res, next) {
    try {
      const userId = this.requireUserId(req, res);
      if (!userId) return;
      const { id } = req.params;

      const playlist = await playlistService.getPlaylistById(id, userId);

      res.status(200).json({
        success: true,
        data: playlist,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/playlists/:id - Update playlist info
  async updatePlaylistInfo(req, res, next) {
    try {
      const userId = this.requireUserId(req, res);
      if (!userId) return;
      const { id } = req.params;
      const { name, description, image, isPublic } = req.body;

      const playlist = await playlistService.updatePlaylistInfo(id, userId, {
        name,
        description,
        image,
        isPublic,
      });

      res.status(200).json({
        success: true,
        data: playlist,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/playlists/:id/songs - Add song to playlist
  async addSongToPlaylist(req, res, next) {
    try {
      const userId = this.requireUserId(req, res);
      if (!userId) return;
      const { id } = req.params;
      const { songId } = req.body;

      const playlist = await playlistService.addSongToPlaylist(id, userId, songId);

      res.status(200).json({
        success: true,
        data: playlist,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/playlists/:id/songs/:songId - Remove song from playlist
  async removeSongFromPlaylist(req, res, next) {
    try {
      const userId = this.requireUserId(req, res);
      if (!userId) return;
      const { id, songId } = req.params;

      const playlist = await playlistService.removeSongFromPlaylist(id, userId, songId);

      res.status(200).json({
        success: true,
        data: playlist,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/playlists/:id - Delete playlist
  async deletePlaylist(req, res, next) {
    try {
      const userId = this.requireUserId(req, res);
      if (!userId) return;
      const { id } = req.params;

      await playlistService.deletePlaylist(id, userId);

      res.status(200).json({
        success: true,
        message: 'Playlist deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PlaylistController();
