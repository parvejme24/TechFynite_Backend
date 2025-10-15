"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactService = exports.ContactService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ContactService {
    async getAllContacts(query) {
        const { page = 1, limit = 10, search, userId, email, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { companyName: { contains: search, mode: 'insensitive' } },
                { projectDetails: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (userId) {
            where.userId = userId;
        }
        if (email) {
            where.email = email;
        }
        const total = await prisma.contact.count({ where });
        const contacts = await prisma.contact.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                user: true,
                replies: {
                    include: {
                        user: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        const totalPages = Math.ceil(total / limit);
        return {
            contacts,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }
    async getContactById(id) {
        return await prisma.contact.findUnique({
            where: { id },
            include: {
                user: true,
                replies: {
                    include: {
                        user: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }
    async getContactsByUserEmail(userEmail) {
        return await prisma.contact.findMany({
            where: { email: userEmail },
            include: {
                user: true,
                replies: {
                    include: {
                        user: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createContact(data) {
        return await prisma.contact.create({
            data,
            include: {
                user: true,
                replies: true,
            },
        });
    }
    async updateContact(id, data) {
        try {
            return await prisma.contact.update({
                where: { id },
                data,
                include: {
                    user: true,
                    replies: {
                        include: {
                            user: true,
                        },
                        orderBy: { createdAt: 'desc' },
                    },
                },
            });
        }
        catch (error) {
            return null;
        }
    }
    async deleteContact(id) {
        try {
            await prisma.contact.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async createContactReply(data) {
        return await prisma.contactReply.create({
            data,
            include: {
                user: true,
                contact: true,
            },
        });
    }
    async getContactStats() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const [totalContacts, totalReplies, contactsThisMonth, contactsLastMonth, recentContacts,] = await Promise.all([
            prisma.contact.count(),
            prisma.contactReply.count(),
            prisma.contact.count({
                where: {
                    createdAt: {
                        gte: startOfMonth,
                    },
                },
            }),
            prisma.contact.count({
                where: {
                    createdAt: {
                        gte: startOfLastMonth,
                        lte: endOfLastMonth,
                    },
                },
            }),
            prisma.contact.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: true,
                    replies: {
                        include: {
                            user: true,
                        },
                    },
                },
            }),
        ]);
        const averageRepliesPerContact = totalContacts > 0 ? totalReplies / totalContacts : 0;
        return {
            totalContacts,
            totalReplies,
            contactsThisMonth,
            contactsLastMonth,
            averageRepliesPerContact,
            recentContacts,
        };
    }
    async contactExists(id) {
        const contact = await prisma.contact.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!contact;
    }
}
exports.ContactService = ContactService;
exports.contactService = new ContactService();
//# sourceMappingURL=contact.service.js.map