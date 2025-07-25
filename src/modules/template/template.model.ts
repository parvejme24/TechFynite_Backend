import { prisma } from '../../config/database';
import { CreateTemplateRequest, UpdateTemplateRequest } from './template.types';

export const TemplateModel = {
  getAll: async () => {
    return prisma.template.findMany({
      include: {
        category: true,
      },
    });
  },
  getById: async (id: string) => {
    return prisma.template.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  },
  create: async (data: CreateTemplateRequest) => {
    return prisma.template.create({ data });
  },
  update: async (id: string, data: UpdateTemplateRequest) => {
    return prisma.template.update({ where: { id }, data });
  },
  delete: async (id: string) => {
    return prisma.template.delete({ where: { id } });
  },
};
