import express from 'express';
import artistController from '../controllers/artistController.js';

const router = express.Router();

// Public routes
router.get('/', artistController.getAllArtists);
router.get('/statistics', artistController.getStatistics);
router.get('/:id', artistController.getArtistById);
router.post('/:id/follow', artistController.followArtist);
router.post('/:id/unfollow', artistController.unfollowArtist);

// Admin routes (TODO: Add authentication middleware)
router.post('/', artistController.createArtist);
router.put('/:id', artistController.updateArtist);
router.delete('/:id', artistController.deleteArtist);

export default router;
