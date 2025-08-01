"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateCategoryModel = void 0;
const database_1 = require("../../config/database");
exports.TemplateCategoryModel = {
    getAll: async () => {
        return database_1.prisma.templateCategory.findMany({
            include: {
                templates: true,
            },
        });
    },
    getById: async (id) => {
        return database_1.prisma.templateCategory.findUnique({
            where: { id },
            include: {
                templates: true,
            },
        });
    },
    create: async (data) => {
        return database_1.prisma.templateCategory.create({ data });
    },
    update: async (id, data) => {
        return database_1.prisma.templateCategory.update({ where: { id }, data });
    },
    delete: async (id) => {
        return database_1.prisma.templateCategory.delete({ where: { id } });
    },
};
