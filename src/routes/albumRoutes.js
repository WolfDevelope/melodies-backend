import express from 'express';
import albumController from '../controllers/albumController.js';

const router = express.Router();

// Public routes
router.get('/', albumController.getAllAlbums);
router.get('/statistics', albumController.getStatistics);
router.get('/:id', albumController.getAlbumById);
router.post('/:id/play', albumController.incrementPlays);
router.post('/:id/like', albumController.toggleLike);

// Admin routes (TODO: Add authentication middleware)
router.post('/', albumController.createAlbum);
router.put('/:id', albumController.updateAlbum);
router.delete('/:id', albumController.deleteAlbum);

export default router;
