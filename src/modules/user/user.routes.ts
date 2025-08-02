import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole
} from './user.controller';
import { authMiddleware } from '../../middlewares/auth';
import { uploadUserProfileCloudinary } from '../../middlewares/cloudinary-upload';
import express from 'express';

const router = Router();

// Get all users (ADMIN/SUPER_ADMIN only)
router.get('/users', authMiddleware, getAllUsers);

// Get user by ID (ADMIN/SUPER_ADMIN only)
router.get('/users/:id', authMiddleware, getUserById);

// Update user profile (with photo upload)
router.put('/users/:id', authMiddleware, 
  uploadUserProfileCloudinary, 
  updateUser
);

// Update user role (ADMIN/SUPER_ADMIN only)
// Handle both JSON and form-data
router.put('/users/:id/role', 
  express.json({ limit: '10mb' }), 
  express.urlencoded({ extended: true, limit: '10mb' }), 
  authMiddleware, 
  updateUserRole
);

export default router; 