"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateModel = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.TemplateModel = {
    findAll: async () => {
        return prisma.template.findMany();
    },
    findById: async (id) => {
        return prisma.template.findUnique({ where: { id } });
    },
    create: async (data) => {
        return prisma.template.create({ data });
    },
    update: async (id, data) => {
        return prisma.template.update({ where: { id }, data });
    },
    delete: async (id) => {
        return prisma.template.delete({ where: { id } });
    },
};
