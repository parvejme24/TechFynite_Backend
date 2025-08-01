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
  getBySlug: async (slug: string) => {
    return prisma.template.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });
  },
  getByCategory: async (categoryId: string) => {
    return prisma.template.findMany({
      where: { categoryId },
      include: {
        category: true,
      },
    });
  },
  create: async (data: CreateTemplateRequest) => {
    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    return prisma.template.create({ 
      data: {
        ...data,
        slug
      }
    });
  },
  update: async (id: string, data: UpdateTemplateRequest) => {
    return prisma.template.update({ where: { id }, data });
  },
  delete: async (id: string) => {
    return prisma.template.delete({ where: { id } });
  },
};
