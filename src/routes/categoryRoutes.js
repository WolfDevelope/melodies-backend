import express from 'express';
import * as categoryController from '../controllers/categoryController.js';

const router = express.Router();

// Get category statistics (must be before /:id route)
router.get('/statistics', categoryController.getCategoryStatistics);

// Get category by slug (must be before /:id route)
router.get('/slug/:slug', categoryController.getCategoryBySlug);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

// Create new category (Admin only)
router.post('/', categoryController.createCategory);

// Update category (Admin only)
router.put('/:id', categoryController.updateCategory);

// Delete category (Admin only)
router.delete('/:id', categoryController.deleteCategory);

// Add songs to category (Admin only)
router.post('/:id/songs', categoryController.addSongsToCategory);

// Remove songs from category (Admin only)
router.delete('/:id/songs', categoryController.removeSongsFromCategory);

// Add albums to category (Admin only)
router.post('/:id/albums', categoryController.addAlbumsToCategory);

// Remove albums from category (Admin only)
router.delete('/:id/albums', categoryController.removeAlbumsFromCategory);

// Add artists to category (Admin only)
router.post('/:id/artists', categoryController.addArtistsToCategory);

// Remove artists from category (Admin only)
router.delete('/:id/artists', categoryController.removeArtistsFromCategory);

// Increment view count
router.put('/:id/view', categoryController.incrementViewCount);

export default router;
