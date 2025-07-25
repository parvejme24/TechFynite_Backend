import { UserModel } from './user.model';
import { UpdateUserRequest, UpdateUserRoleRequest } from './user.types';
import { UserRole } from '../../generated/prisma';

export const UserService = {
  getAll: async () => {
    return UserModel.getAll();
  },

  getById: async (id: string) => {
    return UserModel.getById(id);
  },

  update: async (id: string, data: UpdateUserRequest) => {
    return UserModel.update(id, data);
  },

  updateRole: async (loggedInUserId: string, targetUserId: string, newRole: string) => {
    // Check if logged-in user has permission to update roles
    const loggedInUserRole = await UserModel.getUserRole(loggedInUserId);
    
    if (!loggedInUserRole) {
      throw new Error('Logged-in user not found');
    }

    // Only ADMIN and SUPER_ADMIN can update roles
    if (loggedInUserRole !== UserRole.ADMIN && loggedInUserRole !== UserRole.SUPER_ADMIN) {
      throw new Error('Insufficient permissions. Only ADMIN and SUPER_ADMIN can update user roles.');
    }

    // Check if target user exists
    const targetUser = await UserModel.getById(targetUserId);
    if (!targetUser) {
      throw new Error('Target user not found');
    }

    // SUPER_ADMIN can update any role, ADMIN can only update to USER role
    if (loggedInUserRole === UserRole.ADMIN && newRole !== UserRole.USER) {
      throw new Error('ADMIN can only update users to USER role');
    }

    // Prevent users from updating their own role
    if (loggedInUserId === targetUserId) {
      throw new Error('Users cannot update their own role');
    }

    return UserModel.updateRole(targetUserId, newRole);
  },

  getUserRole: async (id: string) => {
    return UserModel.getUserRole(id);
  },
};
