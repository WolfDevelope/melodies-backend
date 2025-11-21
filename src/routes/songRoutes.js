import express from 'express';
import songController from '../controllers/songController.js';

const router = express.Router();

// Public routes
router.get('/', songController.getAllSongs);
router.get('/statistics', songController.getStatistics);
router.get('/:id', songController.getSongById);
router.post('/:id/play', songController.incrementPlays);
router.post('/:id/like', songController.toggleLike);

// Admin routes (TODO: Add authentication middleware)
router.post('/', songController.createSong);
router.put('/:id', songController.updateSong);
router.delete('/:id', songController.deleteSong);

export default router;
