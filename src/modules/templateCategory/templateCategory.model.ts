import { prisma } from '../../config/database';
import { CreateTemplateCategoryRequest, UpdateTemplateCategoryRequest } from './templateCategory.types';

export const TemplateCategoryModel = {
  getAll: async () => {
    return prisma.templateCategory.findMany({
      include: {
        templates: true,
      },
    });
  },
  getById: async (id: string) => {
    return prisma.templateCategory.findUnique({
      where: { id },
      include: {
        templates: true,
      },
    });
  },
  create: async (data: CreateTemplateCategoryRequest) => {
    return prisma.templateCategory.create({ data });
  },
  update: async (id: string, data: UpdateTemplateCategoryRequest) => {
    return prisma.templateCategory.update({ where: { id }, data });
  },
  delete: async (id: string) => {
    return prisma.templateCategory.delete({ where: { id } });
  },
};
