import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole
} from './user.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

router.get('/users', authMiddleware, getAllUsers);
router.get('/users/:id', authMiddleware, getUserById);
router.put('/users/:id', authMiddleware, updateUser);
router.put('/users/:id/role', authMiddleware, updateUserRole);

export default router; 