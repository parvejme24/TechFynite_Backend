import { PrismaClient, Notification } from '../../generated/prisma';

const prisma = new PrismaClient();

export const NotificationModel = {
  findAll: async (): Promise<Notification[]> => {
    return prisma.notification.findMany();
  },
  findById: async (id: string): Promise<Notification | null> => {
    return prisma.notification.findUnique({ where: { id } });
  },
  create: async (data: any): Promise<Notification> => {
    return prisma.notification.create({ data });
  },
  update: async (id: string, data: any): Promise<Notification> => {
    return prisma.notification.update({ where: { id }, data });
  },
  delete: async (id: string): Promise<Notification> => {
    return prisma.notification.delete({ where: { id } });
  },
}; 