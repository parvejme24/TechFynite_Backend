import { PrismaClient, TemplateCategory } from '../../generated/prisma';

const prisma = new PrismaClient();

export const TemplateCategoryModel = {
  findAll: async (): Promise<TemplateCategory[]> => {
    return prisma.templateCategory.findMany({ include: { templates: true } });
  },
  findById: async (id: string): Promise<TemplateCategory | null> => {
    return prisma.templateCategory.findUnique({ where: { id }, include: { templates: true } });
  },
  // The create method allows adding a new category independently.
  create: async (data: any): Promise<TemplateCategory> => {
    return prisma.templateCategory.create({ data });
  },
  update: async (id: string, data: any): Promise<TemplateCategory> => {
    return prisma.templateCategory.update({ where: { id }, data });
  },
  delete: async (id: string): Promise<TemplateCategory> => {
    return prisma.templateCategory.delete({ where: { id } });
  },
}; 