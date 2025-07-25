import { PrismaClient, Template } from '../../generated/prisma';

const prisma = new PrismaClient();

export const TemplateModel = {
  findAll: async (): Promise<any[]> => {
    return prisma.template.findMany({ include: { category: true } });
  },
  findById: async (id: string): Promise<any | null> => {
    return prisma.template.findUnique({ where: { id }, include: { category: true } });
  },
  create: async (data: any): Promise<Template> => {
    return prisma.template.create({ data });
  },
  update: async (id: string, data: any): Promise<Template> => {
    return prisma.template.update({ where: { id }, data });
  },
  delete: async (id: string): Promise<Template> => {
    return prisma.template.delete({ where: { id } });
  },
}; 