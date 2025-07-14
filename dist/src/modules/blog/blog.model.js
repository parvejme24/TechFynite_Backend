"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.BlogModel = {
    findAll: async () => {
        return prisma.blog.findMany({
            include: {
                category: {
                    select: {
                        id: true,
                        title: true,
                        imageUrl: true,
                        slug: true,
                        blogCount: true,
                    },
                },
                reviews: true,
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        photoUrl: true,
                    },
                },
            },
        });
    },
    findById: async (id) => {
        return prisma.blog.findUnique({
            where: { id },
            include: {
                category: {
                    select: {
                        id: true,
                        title: true,
                        imageUrl: true,
                        slug: true,
                        blogCount: true,
                    },
                },
                reviews: true,
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        photoUrl: true,
                    },
                },
            },
        });
    },
    create: async (data) => {
        return prisma.blog.create({ data });
    },
    update: async (id, data) => {
        return prisma.blog.update({ where: { id }, data });
    },
    delete: async (id) => {
        return prisma.blog.delete({ where: { id } });
    },
    likeBlog: async (blogId, userId) => {
        return prisma.$transaction(async (tx) => {
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
    unlikeBlog: async (blogId, userId) => {
        return prisma.$transaction(async (tx) => {
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
