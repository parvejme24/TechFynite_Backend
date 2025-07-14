"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.NotificationModel = {
    findAll: async () => {
        return prisma.notification.findMany();
    },
    findById: async (id) => {
        return prisma.notification.findUnique({ where: { id } });
    },
    create: async (data) => {
        return prisma.notification.create({ data });
    },
    update: async (id, data) => {
        return prisma.notification.update({ where: { id }, data });
    },
    delete: async (id) => {
        return prisma.notification.delete({ where: { id } });
    },
};
