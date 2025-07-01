import { PrismaClient, BlogReview } from '../../generated/prisma';

const prisma = new PrismaClient();

export const BlogReviewModel = {
  findByBlogId: async (blogId: string): Promise<BlogReview[]> => {
    return prisma.blogReview.findMany({ where: { blogId } });
  },
  findById: async (id: string): Promise<BlogReview | null> => {
    return prisma.blogReview.findUnique({ where: { id } });
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
};
