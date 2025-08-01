"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = require("../../config/database");
const prisma_1 = require("../../generated/prisma");
exports.UserModel = {
    getAll: async () => {
        return database_1.prisma.user.findMany({
            select: {
                id: true,
                displayName: true,
                email: true,
                photoUrl: true,
                designation: true,
                role: true,
                phone: true,
                country: true,
                city: true,
                stateOrRegion: true,
                postCode: true,
                balance: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },
    getById: async (id) => {
        return database_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                displayName: true,
                email: true,
                photoUrl: true,
                designation: true,
                role: true,
                phone: true,
                country: true,
                city: true,
                stateOrRegion: true,
                postCode: true,
                balance: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },
    update: async (id, data) => {
        return database_1.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                displayName: true,
                email: true,
                photoUrl: true,
                designation: true,
                role: true,
                phone: true,
                country: true,
                city: true,
                stateOrRegion: true,
                postCode: true,
                balance: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },
    updateRole: async (id, role) => {
        // Validate role enum
        if (!Object.values(prisma_1.UserRole).includes(role)) {
            throw new Error('Invalid role value');
        }
        return database_1.prisma.user.update({
            where: { id },
            data: { role: role },
            select: {
                id: true,
                displayName: true,
                email: true,
                photoUrl: true,
                designation: true,
                role: true,
                phone: true,
                country: true,
                city: true,
                stateOrRegion: true,
                postCode: true,
                balance: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },
    getUserRole: async (id) => {
        const user = await database_1.prisma.user.findUnique({
            where: { id },
            select: { role: true }
        });
        return user?.role;
    },
};
