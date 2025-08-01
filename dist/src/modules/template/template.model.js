"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateModel = void 0;
const database_1 = require("../../config/database");
exports.TemplateModel = {
    getAll: async () => {
        return database_1.prisma.template.findMany({
            include: {
                category: true,
            },
        });
    },
    getById: async (id) => {
        return database_1.prisma.template.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });
    },
    getBySlug: async (slug) => {
        return database_1.prisma.template.findUnique({
            where: { slug },
            include: {
                category: true,
            },
        });
    },
    getByCategory: async (categoryId) => {
        return database_1.prisma.template.findMany({
            where: { categoryId },
            include: {
                category: true,
            },
        });
    },
    create: async (data) => {
        // Generate slug from title
        const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        return database_1.prisma.template.create({
            data: {
                ...data,
                slug
            }
        });
    },
    update: async (id, data) => {
        return database_1.prisma.template.update({ where: { id }, data });
    },
    delete: async (id) => {
        return database_1.prisma.template.delete({ where: { id } });
    },
};
