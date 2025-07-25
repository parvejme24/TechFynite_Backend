import { prisma } from '../../config/database';
import { UserRole } from '../../generated/prisma';
import { UpdateUserRequest, UpdateUserRoleRequest } from './user.types';

export const UserModel = {
  getAll: async () => {
    return prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        email: true,
        photoUrl: true,
        designation: true,
        role: true,
        phone: true,
        country: true,
        city: true,
        stateOrRegion: true,
        postCode: true,
        balance: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  getById: async (id: string) => {
    return prisma.user.findUnique({ 
      where: { id },
      select: {
        id: true,
        displayName: true,
        email: true,
        photoUrl: true,
        designation: true,
        role: true,
        phone: true,
        country: true,
        city: true,
        stateOrRegion: true,
        postCode: true,
        balance: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  update: async (id: string, data: UpdateUserRequest) => {
    return prisma.user.update({ 
      where: { id }, 
      data,
      select: {
        id: true,
        displayName: true,
        email: true,
        photoUrl: true,
        designation: true,
        role: true,
        phone: true,
        country: true,
        city: true,
        stateOrRegion: true,
        postCode: true,
        balance: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  updateRole: async (id: string, role: string) => {
    // Validate role enum
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new Error('Invalid role value');
    }

    return prisma.user.update({ 
      where: { id }, 
      data: { role: role as UserRole },
      select: {
        id: true,
        displayName: true,
        email: true,
        photoUrl: true,
        designation: true,
        role: true,
        phone: true,
        country: true,
        city: true,
        stateOrRegion: true,
        postCode: true,
        balance: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  getUserRole: async (id: string) => {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
    });
    return user?.role;
  },
};
