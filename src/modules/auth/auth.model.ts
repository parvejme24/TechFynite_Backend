import { PrismaClient, User } from '../../generated/prisma';

const prisma = new PrismaClient();

export const AuthModel = {
  findByEmail: async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { email } });
  },
  findById: async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id } });
  },
  create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'otpCode' | 'otpExpiresAt' | 'isVerified' | 'refreshToken'>): Promise<User> => {
    return prisma.user.create({ data });
  },
  update: async (id: string, data: Partial<User>): Promise<User> => {
    return prisma.user.update({ where: { id }, data });
  },
  updateByEmail: async (email: string, data: Partial<User>): Promise<User> => {
    return prisma.user.update({ where: { email }, data });
  },
}; 