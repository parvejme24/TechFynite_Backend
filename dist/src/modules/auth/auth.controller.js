"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserStatus = exports.updateUserRole = exports.getAllUsers = exports.uploadProfilePhoto = exports.changePassword = exports.updateProfile = exports.getProfile = exports.logout = exports.resetPassword = exports.forgotPassword = exports.resendVerificationEmail = exports.verifyEmail = exports.refreshToken = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
// Public routes
const register = async (req, res) => {
    try {
        const result = await auth_service_1.AuthService.register(req.body);
        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email for verification.',
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const result = await auth_service_1.AuthService.login(req.body);
        res.json({
            success: true,
            message: 'Login successful',
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await auth_service_1.AuthService.refreshToken(refreshToken);
        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: result
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: error.message
        });
    }
};
exports.refreshToken = refreshToken;
const verifyEmail = async (req, res) => {
    try {
        const { email, otpCode } = req.body;
        const result = await auth_service_1.AuthService.verifyEmail(email, otpCode);
        res.json({
            success: true,
            message: 'Email verified successfully',
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.verifyEmail = verifyEmail;
const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        await auth_service_1.AuthService.resendVerificationEmail(email);
        res.json({
            success: true,
            message: 'Verification email sent successfully'
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.resendVerificationEmail = resendVerificationEmail;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        await auth_service_1.AuthService.forgotPassword(email);
        res.json({
            success: true,
            message: 'Password reset email sent successfully'
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const result = await auth_service_1.AuthService.resetPassword(req.body);
        res.json({
            success: true,
            message: 'Password reset successfully',
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.resetPassword = resetPassword;
// Protected routes
const logout = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
        }
        await auth_service_1.AuthService.logout(userId);
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.logout = logout;
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
        }
        const user = await auth_service_1.AuthService.getCurrentUser(userId);
        res.json({
            success: true,
            data: { user }
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
        }
        const result = await auth_service_1.AuthService.updateProfile(userId, req.body);
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
        }
        const { currentPassword, newPassword } = req.body;
        await auth_service_1.AuthService.changePassword(userId, currentPassword, newPassword);
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.changePassword = changePassword;
const uploadProfilePhoto = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
        }
        let photoUrl = req.body.photoUrl;
        if (req.file) {
            photoUrl = req.file.path; // Cloudinary URL
        }
        const result = await auth_service_1.AuthService.updateProfilePhoto(userId, photoUrl);
        res.json({
            success: true,
            message: 'Profile photo updated successfully',
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.uploadProfilePhoto = uploadProfilePhoto;
// Admin routes
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, role } = req.query;
        const result = await auth_service_1.AuthService.getAllUsers({
            page: Number(page),
            limit: Number(limit),
            search: search,
            role: role
        });
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getAllUsers = getAllUsers;
const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        const adminUserId = req.user?.userId;
        if (!adminUserId) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
        }
        const result = await auth_service_1.AuthService.updateUserRole(adminUserId, userId, role);
        res.json({
            success: true,
            message: 'User role updated successfully',
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.updateUserRole = updateUserRole;
const updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isVerified } = req.body;
        const adminUserId = req.user?.userId;
        if (!adminUserId) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
        }
        const result = await auth_service_1.AuthService.updateUserStatus(adminUserId, userId, isVerified);
        res.json({
            success: true,
            message: 'User status updated successfully',
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.updateUserStatus = updateUserStatus;
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminUserId = req.user?.userId;
        if (!adminUserId) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
        }
        await auth_service_1.AuthService.deleteUser(adminUserId, userId);
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.deleteUser = deleteUser;
