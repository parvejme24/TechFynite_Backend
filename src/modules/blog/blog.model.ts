import { prisma } from '../../config/database';
import { CreateBlogRequest, UpdateBlogRequest } from './blog.types';

export const BlogModel = {
  getAll: async () => {
    return prisma.blog.findMany({
      include: {
        category: true,
        reviews: true,
        content: true, // Include all content sections
      },
    });
  },
  getById: async (id: string) => {
    return prisma.blog.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: true,
        content: true, // Include all content sections
      },
    });
  },
  create: async (data: CreateBlogRequest) => {
    const { content, ...rest } = data;
    return prisma.blog.create({
      data: {
        ...rest,
        ...(content && content.length > 0 ? { content: { create: content } } : {}),
      },
    });
  },
  update: async (id: string, data: UpdateBlogRequest) => {
    const { content, categoryId, ...rest } = data;
    const updateData: any = {
      ...rest,
      ...(categoryId !== undefined ? { categoryId } : {}),
    };
    if (content) {
      updateData.content = {
        deleteMany: {},
        create: content,
      };
    }
    return prisma.blog.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        reviews: true,
        content: true,
      },
    });
  },
  delete: async (id: string) => {
    return prisma.blog.delete({ where: { id } });
  },
  likeBlog: async (blogId: string, userId: string) => {
    const existing = await prisma.blogLike.findUnique({ where: { blogId_userId: { blogId, userId } } });
    if (!existing) {
      await prisma.blogLike.create({ data: { blogId, userId } });
      await prisma.blog.update({ where: { id: blogId }, data: { likes: { increment: 1 } } });
    }
    return prisma.blog.findUnique({
      where: { id: blogId },
      include: { category: true, reviews: true, content: true },
    });
  },
  unlikeBlog: async (blogId: string, userId: string) => {
    const existing = await prisma.blogLike.findUnique({ where: { blogId_userId: { blogId, userId } } });
    if (existing) {
      await prisma.blogLike.delete({ where: { blogId_userId: { blogId, userId } } });
      await prisma.blog.update({ where: { id: blogId }, data: { likes: { decrement: 1 } } });
    }
    return prisma.blog.findUnique({
      where: { id: blogId },
      include: { category: true, reviews: true, content: true },
    });
  },
};
