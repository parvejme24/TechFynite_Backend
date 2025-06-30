import { PrismaClient, User } from '../../generated/prisma';

const prisma = new PrismaClient();

export const UserModel = {
  findAll: async (): Promise<User[]> => {
    return prisma.user.findMany();
  },
  findById: async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id } });
  },
  update: async (id: string, data: any): Promise<User> => {
    return prisma.user.update({ where: { id }, data });
  },
  updateRole: async (id: string, role: 'USER' | 'ADMIN'): Promise<User> => {
    return prisma.user.update({ where: { id }, data: { role } });
  },
}; 