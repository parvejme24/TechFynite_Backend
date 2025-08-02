"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const user_service_1 = require("./user.service");
const prisma_1 = require("../../generated/prisma");
const ALLOWED_PROFILE_FIELDS = [
    'displayName',
    'phone',
    'country',
    'city',
    'stateOrRegion',
    'postCode',
    'designation',
];
const getAllUsers = async (req, res) => {
    try {
        const users = await user_service_1.UserService.getAll();
        res.json({
            success: true,
            data: users,
            message: 'Users fetched successfully'
        });
    }
    catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users',
            details: error instanceof Error ? error.message : error
        });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const user = await user_service_1.UserService.getById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user,
            message: 'User fetched successfully'
        });
    }
    catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user',
            details: error instanceof Error ? error.message : error
        });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        let photoUrl = req.file ? req.file.path : req.body.photoUrl;
        // Only allow updating allowed fields (email is not allowed)
        const updateData = { photoUrl };
        for (const field of ALLOWED_PROFILE_FIELDS) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }
        const user = await user_service_1.UserService.update(req.params.id, updateData);
        res.json({
            success: true,
            data: user,
            message: 'User updated successfully'
        });
    }
    catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update user',
            details: error instanceof Error ? error.message : error
        });
    }
};
exports.updateUser = updateUser;
const updateUserRole = async (req, res) => {
    try {
        // Debug logging
        console.log('=== ROLE UPDATE DEBUG ===');
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('Request method:', req.method);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Body type:', typeof req.body);
        console.log('Body keys:', req.body ? Object.keys(req.body) : 'No body');
        console.log('Raw body:', req.body);
        console.log('========================');
        // Handle different content types
        let roleValue = null;
        // Check if body exists and has content
        if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
            roleValue = req.body.role;
        }
        else if (req.body && typeof req.body === 'string') {
            // Handle raw string body
            try {
                const parsed = JSON.parse(req.body);
                roleValue = parsed.role;
            }
            catch (e) {
                console.log('Failed to parse string body as JSON');
            }
        }
        console.log('Extracted role value:', roleValue);
        // Validate request body
        if (!req.body || (typeof req.body === 'object' && Object.keys(req.body).length === 0)) {
            console.log('Body validation failed - req.body is empty or missing');
            return res.status(400).json({
                success: false,
                error: 'Request body is required. Please send: {"role": "ADMIN"}'
            });
        }
        if (!roleValue) {
            return res.status(400).json({
                success: false,
                error: 'Role is required in request body. Example: {"role": "ADMIN"}'
            });
        }
        // Validate role enum
        if (!Object.values(prisma_1.UserRole).includes(roleValue)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid role value. Must be one of: USER, ADMIN, SUPER_ADMIN'
            });
        }
        // Get logged-in user ID from auth middleware
        const loggedInUserId = req.user?.userId;
        if (!loggedInUserId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        const targetUserId = req.params.id;
        const updatedUser = await user_service_1.UserService.updateRole(loggedInUserId, targetUserId, roleValue);
        res.json({
            success: true,
            data: updatedUser,
            message: 'User role updated successfully'
        });
    }
    catch (error) {
        console.error('Update user role error:', error);
        // Handle specific authorization errors
        if (error instanceof Error) {
            if (error.message.includes('Insufficient permissions')) {
                return res.status(403).json({
                    success: false,
                    error: error.message
                });
            }
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }
            if (error.message.includes('cannot update their own role')) {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }
        }
        res.status(500).json({
            success: false,
            error: 'Failed to update user role',
            details: error instanceof Error ? error.message : error
        });
    }
};
exports.updateUserRole = updateUserRole;
