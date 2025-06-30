import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
} from './user.controller';

const router = Router();

router.get('/users', getAllUsers); // admin only
router.get('/users/:id', getUserById); // self or admin
router.put('/users/:id', updateUser); // self or admin
router.patch('/users/:id/role', updateUserRole); // admin only

export default router; 