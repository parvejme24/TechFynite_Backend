import { PrismaClient, OrderInvoice } from '../../generated/prisma';

const prisma = new PrismaClient();

export const OrderModel = {
  findAll: async (): Promise<OrderInvoice[]> => {
    return prisma.orderInvoice.findMany();
  },
  findById: async (id: string): Promise<OrderInvoice | null> => {
    return prisma.orderInvoice.findUnique({ where: { id } });
  },
  create: async (data: any): Promise<OrderInvoice> => {
    return prisma.orderInvoice.create({ data });
  },
  update: async (id: string, data: any): Promise<OrderInvoice> => {
    return prisma.orderInvoice.update({ where: { id }, data });
  },
  delete: async (id: string): Promise<OrderInvoice> => {
    return prisma.orderInvoice.delete({ where: { id } });
  },
  findByUserId: async (userId: string): Promise<OrderInvoice[]> => {
    return prisma.orderInvoice.findMany({ where: { userId } });
  },
}; 