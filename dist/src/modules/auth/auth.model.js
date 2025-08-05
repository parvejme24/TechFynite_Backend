"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.AuthModel = {
    findByEmail: async (email) => {
        return prisma.user.findUnique({ where: { email } });
    },
    findById: async (id) => {
        return prisma.user.findUnique({ where: { id } });
    },
    create: async (data) => {
        return prisma.user.create({ data });
    },
    update: async (id, data) => {
        return prisma.user.update({ where: { id }, data });
    },
    updateByEmail: async (email, data) => {
        return prisma.user.update({ where: { email }, data });
    },
    findMany: async (where, options = {}) => {
        return prisma.user.findMany({ where, ...options });
    },
    count: async (where = {}) => {
        return prisma.user.count({ where });
    },
    delete: async (id) => {
        return prisma.user.delete({ where: { id } });
    },
};
