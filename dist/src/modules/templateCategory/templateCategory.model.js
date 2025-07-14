"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateCategoryModel = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.TemplateCategoryModel = {
    findAll: async () => {
        return prisma.templateCategory.findMany({ include: { templates: true } });
    },
    findById: async (id) => {
        return prisma.templateCategory.findUnique({ where: { id }, include: { templates: true } });
    },
    create: async (data) => {
        return prisma.templateCategory.create({ data });
    },
    update: async (id, data) => {
        return prisma.templateCategory.update({ where: { id }, data });
    },
    delete: async (id) => {
        return prisma.templateCategory.delete({ where: { id } });
    },
};
