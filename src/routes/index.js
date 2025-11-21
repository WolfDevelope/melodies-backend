import express from 'express';
import authRoutes from './authRoutes.js';
import songRoutes from './songRoutes.js';
import artistRoutes from './artistRoutes.js';

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Song routes
router.use('/songs', songRoutes);

// Artist routes
router.use('/artists', artistRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
