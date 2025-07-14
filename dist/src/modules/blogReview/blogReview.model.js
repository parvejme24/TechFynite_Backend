"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogReviewModel = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.BlogReviewModel = {
    findByBlogId: async (blogId) => {
        return prisma.blogReview.findMany({ where: { blogId } });
    },
    findById: async (id) => {
        return prisma.blogReview.findUnique({ where: { id } });
    },
    create: async (data) => {
        return prisma.blogReview.create({ data });
    },
    update: async (id, data) => {
        return prisma.blogReview.update({ where: { id }, data });
    },
    delete: async (id) => {
        return prisma.blogReview.delete({ where: { id } });
    },
};
