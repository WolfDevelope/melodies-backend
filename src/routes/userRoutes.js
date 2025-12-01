import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// Get user statistics (must be before /:id route)
router.get('/statistics', userController.getUserStatistics);

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user role (Admin only)
router.put('/:id/role', userController.updateUserRole);

// Update user status (Admin only)
router.put('/:id/status', userController.updateUserStatus);

// Delete user (Admin only)
router.delete('/:id', userController.deleteUser);

export default router;
