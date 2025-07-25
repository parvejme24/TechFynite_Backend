import { prisma } from '../../config/database';
import { CreateBlogCategoryRequest, UpdateBlogCategoryRequest } from './blogCategory.types';

export const BlogCategoryModel = {
  getAll: async () => {
    return prisma.blogCategory.findMany();
  },
  getById: async (id: string) => {
    return prisma.blogCategory.findUnique({ where: { id } });
  },
  create: async (data: CreateBlogCategoryRequest) => {
    return prisma.blogCategory.create({ data });
  },
  update: async (id: string, data: UpdateBlogCategoryRequest) => {
    return prisma.blogCategory.update({ where: { id }, data });
  },
  delete: async (id: string) => {
    return prisma.blogCategory.delete({ where: { id } });
  },
};
