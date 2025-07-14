"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.OrderModel = {
    findAll: async () => {
        return prisma.orderInvoice.findMany();
    },
    findById: async (id) => {
        return prisma.orderInvoice.findUnique({ where: { id } });
    },
    create: async (data) => {
        return prisma.orderInvoice.create({ data });
    },
    update: async (id, data) => {
        return prisma.orderInvoice.update({ where: { id }, data });
    },
    delete: async (id) => {
        return prisma.orderInvoice.delete({ where: { id } });
    },
    findByUserId: async (userId) => {
        return prisma.orderInvoice.findMany({ where: { userId } });
    },
};
