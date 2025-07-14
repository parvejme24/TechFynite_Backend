"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.UserModel = {
    findAll: async () => {
        return prisma.user.findMany();
    },
    findById: async (id) => {
        return prisma.user.findUnique({ where: { id } });
    },
    update: async (id, data) => {
        return prisma.user.update({ where: { id }, data });
    },
    updateRole: async (id, role) => {
        return prisma.user.update({ where: { id }, data: { role } });
    },
};
