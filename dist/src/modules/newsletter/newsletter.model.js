"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterModel = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.NewsletterModel = {
    create: async (email) => {
        return prisma.newsletter.create({ data: { email } });
    },
    findByEmail: async (email) => {
        return prisma.newsletter.findUnique({ where: { email } });
    },
};
