import express from 'express';
import authRoutes from './authRoutes.js';
import songRoutes from './songRoutes.js';
import artistRoutes from './artistRoutes.js';
import albumRoutes from './albumRoutes.js';
import userRoutes from './userRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import homeRoutes from './homeRoutes.js';

const router = express.Router();

// Home routes (public)
router.use('/home', homeRoutes);

// Auth routes
router.use('/auth', authRoutes);

// Song routes
router.use('/songs', songRoutes);

// Artist routes
router.use('/artists', artistRoutes);

// Album routes
router.use('/albums', albumRoutes);

// User routes
router.use('/users', userRoutes);

// Category routes
router.use('/categories', categoryRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
