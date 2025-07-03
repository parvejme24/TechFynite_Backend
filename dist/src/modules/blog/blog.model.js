"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.BlogModel = {
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
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
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
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
    }),
    create: (data) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.blog.create({ data });
    }),
    update: (id, data) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.blog.update({ where: { id }, data });
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.blog.delete({ where: { id } });
    }),
    likeBlog: (blogId, userId) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield tx.blogLike.create({
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
        }));
    }),
    unlikeBlog: (blogId, userId) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield tx.blogLike.delete({
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
        }));
    }),
};
