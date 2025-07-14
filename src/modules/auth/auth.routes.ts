import { Router } from 'express';
import {
  register,
  login,
  verifyOtp,
  refreshToken,
  resetPasswordRequest,
  resetPassword,
  logout,
  getCurrentUser,
} from './auth.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/refresh-token', refreshToken);
router.post('/reset-password-request', resetPasswordRequest);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);
router.get('/me', authMiddleware, getCurrentUser);

export default router; 