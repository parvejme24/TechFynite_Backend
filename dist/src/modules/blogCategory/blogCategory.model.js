"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogCategoryModel = void 0;
const database_1 = require("../../config/database");
exports.BlogCategoryModel = {
    getAll: async () => {
        return database_1.prisma.blogCategory.findMany();
    },
    getById: async (id) => {
        return database_1.prisma.blogCategory.findUnique({ where: { id } });
    },
    create: async (data) => {
        return database_1.prisma.blogCategory.create({ data });
    },
    update: async (id, data) => {
        return database_1.prisma.blogCategory.update({ where: { id }, data });
    },
    delete: async (id) => {
        return database_1.prisma.blogCategory.delete({ where: { id } });
    },
};
