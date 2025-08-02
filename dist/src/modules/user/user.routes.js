"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = require("../../middlewares/auth");
const cloudinary_upload_1 = require("../../middlewares/cloudinary-upload");
const express_2 = __importDefault(require("express"));
const router = (0, express_1.Router)();
// Get all users (ADMIN/SUPER_ADMIN only)
router.get('/users', auth_1.authMiddleware, user_controller_1.getAllUsers);
// Get user by ID (ADMIN/SUPER_ADMIN only)
router.get('/users/:id', auth_1.authMiddleware, user_controller_1.getUserById);
// Update user profile (with photo upload)
router.put('/users/:id', auth_1.authMiddleware, cloudinary_upload_1.uploadUserProfileCloudinary, user_controller_1.updateUser);
// Update user role (ADMIN/SUPER_ADMIN only)
// Handle both JSON and form-data
router.put('/users/:id/role', express_2.default.json({ limit: '10mb' }), express_2.default.urlencoded({ extended: true, limit: '10mb' }), auth_1.authMiddleware, user_controller_1.updateUserRole);
exports.default = router;
