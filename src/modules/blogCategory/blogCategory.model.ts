import { PrismaClient, BlogCategory } from '../../generated/prisma';

const prisma = new PrismaClient();

export const BlogCategoryModel = {
  findAll: async (): Promise<BlogCategory[]> => {
    return prisma.blogCategory.findMany({ include: { blogs: true } });
  },
  findById: async (id: string): Promise<BlogCategory | null> => {
    return prisma.blogCategory.findUnique({ where: { id }, include: { blogs: true } });
  },
  create: async (data: any): Promise<BlogCategory> => {
    return prisma.blogCategory.create({ data });
  },
  update: async (id: string, data: any): Promise<BlogCategory> => {
    return prisma.blogCategory.update({ where: { id }, data });
  },
  delete: async (id: string): Promise<BlogCategory> => {
    return prisma.blogCategory.delete({ where: { id } });
  },
}; 