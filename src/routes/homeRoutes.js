import express from 'express';
import * as homeController from '../controllers/homeController.js';

const router = express.Router();

/**
 * @route   GET /api/home
 * @desc    Get homepage data with featured categories and content
 * @access  Public
 */
router.get('/', homeController.getHomePageData);

/**
 * @route   GET /api/home/recommendations
 * @desc    Get personalized recommendations
 * @access  Public
 */
router.get('/recommendations', homeController.getRecommendations);

/**
 * @route   GET /api/home/category/:id
 * @desc    Get category details with its content
 * @access  Public
 */
router.get('/category/:id', homeController.getCategoryWithContent);

export default router;
