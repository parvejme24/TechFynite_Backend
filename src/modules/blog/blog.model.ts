import { PrismaClient, Blog } from '../../generated/prisma';

const prisma = new PrismaClient();

export const BlogModel = {
  findAll: async (): Promise<Blog[]> => {
    return prisma.blog.findMany({ include: { category: true, author: true, reviews: true } });
  },
  findById: async (id: string): Promise<Blog | null> => {
    return prisma.blog.findUnique({ where: { id }, include: { category: true, author: true, reviews: true } });
  },
  create: async (data: any): Promise<Blog> => {
    return prisma.blog.create({ data });
  },
  update: async (id: string, data: any): Promise<Blog> => {
    return prisma.blog.update({ where: { id }, data });
  },
  delete: async (id: string): Promise<Blog> => {
    return prisma.blog.delete({ where: { id } });
  },
  likeBlog: async (blogId: string, userId: string): Promise<Blog | null> => {
    return prisma.$transaction(async tx => {
      await tx.blogLike.create({
        data: {
          blogId,
          userId,
        },
      });
      return tx.blog.update({
        where: { id: blogId },
        data: {
          likes: {
            increment: 1,
          },
        },
      });
    });
  },
  unlikeBlog: async (blogId: string, userId: string): Promise<Blog | null> => {
    return prisma.$transaction(async tx => {
      await tx.blogLike.delete({
        where: {
          blogId_userId: {
            blogId,
            userId,
          },
        },
      });
      return tx.blog.update({
        where: { id: blogId },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });
    });
  },
}; 