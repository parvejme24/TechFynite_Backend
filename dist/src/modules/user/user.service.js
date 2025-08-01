"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("./user.model");
const prisma_1 = require("../../generated/prisma");
exports.UserService = {
    getAll: async () => {
        return user_model_1.UserModel.getAll();
    },
    getById: async (id) => {
        return user_model_1.UserModel.getById(id);
    },
    update: async (id, data) => {
        return user_model_1.UserModel.update(id, data);
    },
    updateRole: async (loggedInUserId, targetUserId, newRole) => {
        // Check if logged-in user has permission to update roles
        const loggedInUserRole = await user_model_1.UserModel.getUserRole(loggedInUserId);
        if (!loggedInUserRole) {
            throw new Error('Logged-in user not found');
        }
        // Only ADMIN and SUPER_ADMIN can update roles
        if (loggedInUserRole !== prisma_1.UserRole.ADMIN && loggedInUserRole !== prisma_1.UserRole.SUPER_ADMIN) {
            throw new Error('Insufficient permissions. Only ADMIN and SUPER_ADMIN can update user roles.');
        }
        // Check if target user exists
        const targetUser = await user_model_1.UserModel.getById(targetUserId);
        if (!targetUser) {
            throw new Error('Target user not found');
        }
        // SUPER_ADMIN can update any role, ADMIN can only update to USER role
        if (loggedInUserRole === prisma_1.UserRole.ADMIN && newRole !== prisma_1.UserRole.USER) {
            throw new Error('ADMIN can only update users to USER role');
        }
        // Prevent users from updating their own role
        if (loggedInUserId === targetUserId) {
            throw new Error('Users cannot update their own role');
        }
        return user_model_1.UserModel.updateRole(targetUserId, newRole);
    },
    getUserRole: async (id) => {
        return user_model_1.UserModel.getUserRole(id);
    },
};
