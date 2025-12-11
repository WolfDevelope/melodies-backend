import express from 'express';
import playlistController from '../controllers/playlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// TODO: Enable authentication in production
// For development, temporarily disable auth
// router.use(protect);

// Playlist CRUD
router.post('/', playlistController.createPlaylist);
router.get('/', playlistController.getUserPlaylists);
router.get('/:id', playlistController.getPlaylistById);
router.put('/:id', playlistController.updatePlaylistInfo);
router.delete('/:id', playlistController.deletePlaylist);

// Playlist songs management
router.post('/:id/songs', playlistController.addSongToPlaylist);
router.delete('/:id/songs/:songId', playlistController.removeSongFromPlaylist);

export default router;
