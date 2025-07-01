import { PrismaClient, BlogReview } from '../../generated/prisma';

const prisma = new PrismaClient();

export const BlogReviewModel = {
  findAll: async (): Promise<BlogReview[]> => {
    return prisma.blogReview.findMany({ include: { blog: true } });
  },
  findById: async (id: string): Promise<BlogReview | null> => {
    return prisma.blogReview.findUnique({ where: { id }, include: { blog: true } });
  },
  create: async (data: any): Promise<BlogReview> => {
    return prisma.blogReview.create({ data });
  },
  update: async (id: string, data: any): Promise<BlogReview> => {
    return prisma.blogReview.update({ where: { id }, data });
  },
  delete: async (id: string): Promise<BlogReview> => {
    return prisma.blogReview.delete({ where: { id } });
  },
  findByBlogId: async (blogId: string): Promise<BlogReview[]> => {
    return prisma.blogReview.findMany({ where: { blogId } });
  },
}; 