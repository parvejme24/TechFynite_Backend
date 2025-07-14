"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogCategoryModel = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.BlogCategoryModel = {
    findAll: async () => {
        return prisma.blogCategory.findMany({ include: { blogs: true } });
    },
    findById: async (id) => {
        return prisma.blogCategory.findUnique({ where: { id }, include: { blogs: true } });
    },
    create: async (data) => {
        return prisma.blogCategory.create({ data });
    },
    update: async (id, data) => {
        return prisma.blogCategory.update({ where: { id }, data });
    },
    delete: async (id) => {
        return prisma.blogCategory.delete({ where: { id } });
    },
};
