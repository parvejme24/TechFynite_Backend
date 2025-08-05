"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const auth_middleware_1 = require("./auth.middleware");
const cloudinary_upload_1 = require("../../middlewares/cloudinary-upload");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', auth_validation_1.validateRegister, auth_controller_1.register);
router.post('/login', auth_validation_1.validateLogin, auth_controller_1.login);
router.post('/refresh-token', auth_validation_1.validateRefreshToken, auth_controller_1.refreshToken);
router.post('/verify-email', auth_validation_1.validateOtp, auth_controller_1.verifyEmail);
router.post('/resend-verification', auth_validation_1.validateEmail, auth_controller_1.resendVerificationEmail);
router.post('/forgot-password', auth_validation_1.validateEmail, auth_controller_1.forgotPassword);
router.post('/reset-password', auth_validation_1.validateResetPassword, auth_controller_1.resetPassword);
// Protected routes (require authentication)
router.post('/logout', auth_middleware_1.authenticate, auth_controller_1.logout);
router.get('/profile', auth_middleware_1.authenticate, auth_controller_1.getProfile);
router.put('/profile', auth_middleware_1.authenticate, auth_validation_1.validateUpdateProfile, auth_controller_1.updateProfile);
router.put('/change-password', auth_middleware_1.authenticate, auth_validation_1.validateChangePassword, auth_controller_1.changePassword);
router.put('/upload-photo', auth_middleware_1.authenticate, cloudinary_upload_1.uploadUserProfileCloudinary, auth_controller_1.uploadProfilePhoto);
// Admin routes (require admin role)
router.get('/users', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, auth_validation_1.validateGetUsers, auth_controller_1.getAllUsers);
router.post('/admin/users', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, auth_validation_1.validateCreateAdminUser, auth_controller_1.register);
router.put('/admin/users/:userId/role', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, auth_validation_1.validateUpdateUserRole, auth_controller_1.updateUserRole);
router.put('/admin/users/:userId/status', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, auth_validation_1.validateUpdateUserStatus, auth_controller_1.updateUserStatus);
router.delete('/admin/users/:userId', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, auth_validation_1.validateUserId, auth_controller_1.deleteUser);
exports.default = router;
