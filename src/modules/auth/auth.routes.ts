import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePhoto,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} from './auth.controller';
import { 
  validateRegister,
  validateLogin,
  validateRefreshToken,
  validateOtp,
  validateEmail,
  validateResetPassword,
  validateUpdateProfile,
  validateChangePassword,
  validateGetUsers,
  validateCreateAdminUser,
  validateUpdateUserRole,
  validateUpdateUserStatus,
  validateUserId,
} from './auth.validation';
import { 
  authenticate, 
  requireAdmin 
} from './auth.middleware';
import { uploadUserProfileCloudinary } from '../../middlewares/cloudinary-upload';

const router = Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', validateRefreshToken, refreshToken);
router.post('/verify-email', validateOtp, verifyEmail);
router.post('/resend-verification', validateEmail, resendVerificationEmail);
router.post('/forgot-password', validateEmail, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);

// Protected routes (require authentication)
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validateUpdateProfile, updateProfile);
router.put('/change-password', authenticate, validateChangePassword, changePassword);
router.put('/upload-photo', authenticate, uploadUserProfileCloudinary, uploadProfilePhoto);

// Admin routes (require admin role)
router.get('/users', authenticate, requireAdmin, validateGetUsers, getAllUsers);
// router.post('/admin/users', authenticate, requireAdmin, validateCreateAdminUser, register);
router.put('/admin/users/:userId/role', authenticate, requireAdmin, validateUpdateUserRole, updateUserRole);
router.put('/admin/users/:userId/status', authenticate, requireAdmin, validateUpdateUserStatus, updateUserStatus);
router.delete('/admin/users/:userId', authenticate, requireAdmin, validateUserId, deleteUser);

export default router; 