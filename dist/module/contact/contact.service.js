"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ContactService {
    async addNewContact(data) {
        const contact = await prisma.contact.create({
            data: {
                projectDetails: data.projectDetails,
                budget: data.budget,
                fullName: data.fullName,
                email: data.email,
                companyName: data.companyName,
                serviceRequired: data.serviceRequired,
                userId: data.userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                        profile: {
                            select: {
                                avatarUrl: true,
                            },
                        },
                    },
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                role: true,
                                profile: {
                                    select: {
                                        avatarUrl: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        return contact;
    }
    async getAllContacts(page = 1, limit = 10, status, search) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { companyName: { contains: search, mode: "insensitive" } },
                { serviceRequired: { contains: search, mode: "insensitive" } },
            ];
        }
        const [contacts, total] = await Promise.all([
            prisma.contact.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            role: true,
                            profile: {
                                select: {
                                    avatarUrl: true,
                                },
                            },
                        },
                    },
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    email: true,
                                    role: true,
                                    profile: {
                                        select: {
                                            avatarUrl: true,
                                        },
                                    },
                                },
                            },
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.contact.count({ where }),
        ]);
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
        const contact = await prisma.contact.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                        profile: {
                            select: {
                                avatarUrl: true,
                            },
                        },
                    },
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                role: true,
                                profile: {
                                    select: {
                                        avatarUrl: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        return contact;
    }
    async getUserContacts(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [contacts, total] = await Promise.all([
            prisma.contact.findMany({
                where: { userId },
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            role: true,
                            profile: {
                                select: {
                                    avatarUrl: true,
                                },
                            },
                        },
                    },
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    email: true,
                                    role: true,
                                    profile: {
                                        select: {
                                            avatarUrl: true,
                                        },
                                    },
                                },
                            },
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.contact.count({ where: { userId } }),
        ]);
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
    async getContactsByUserEmail(userEmail, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [contacts, total] = await Promise.all([
            prisma.contact.findMany({
                where: { email: userEmail },
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            role: true,
                            profile: {
                                select: {
                                    avatarUrl: true,
                                },
                            },
                        },
                    },
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    email: true,
                                    role: true,
                                    profile: {
                                        select: {
                                            avatarUrl: true,
                                        },
                                    },
                                },
                            },
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.contact.count({ where: { email: userEmail } }),
        ]);
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
    async deleteContact(id, userId, userRole) {
        const contact = await prisma.contact.findUnique({
            where: { id },
        });
        if (!contact) {
            return {
                success: false,
                message: "Contact not found",
            };
        }
        if (userRole === "ADMIN") {
            await prisma.contact.delete({
                where: { id },
            });
            return {
                success: true,
                message: "Contact deleted successfully",
            };
        }
        if (userId && contact.userId !== userId) {
            return {
                success: false,
                message: "You don't have permission to delete this contact",
            };
        }
        await prisma.contact.delete({
            where: { id },
        });
        return {
            success: true,
            message: "Contact deleted successfully",
        };
    }
    async sendContactReply(contactId, userId, data) {
        const contact = await prisma.contact.findUnique({
            where: { id: contactId },
        });
        if (!contact) {
            throw new Error("Contact not found");
        }
        const reply = await prisma.contactReply.create({
            data: {
                subject: data.subject,
                message: data.message,
                contactId,
                userId,
            },
            include: {
                contact: true,
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                        profile: {
                            select: {
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
        });
        return reply;
    }
    async getContactReplies(contactId) {
        const replies = await prisma.contactReply.findMany({
            where: { contactId },
            include: {
                contact: true,
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                        profile: {
                            select: {
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return replies;
    }
    async getContactStats(period = "monthly", startDate, endDate) {
        const now = new Date();
        let windowStart;
        let windowEnd;
        if (startDate && endDate) {
            windowStart = new Date(startDate);
            windowEnd = new Date(endDate);
        }
        else {
            switch (period) {
                case "daily": {
                    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    windowStart = dayStart;
                    windowEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
                    break;
                }
                case "weekly": {
                    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    windowStart = weekStart;
                    break;
                }
                case "yearly": {
                    const yearStart = new Date(now.getFullYear(), 0, 1);
                    windowStart = yearStart;
                    break;
                }
                case "monthly":
                default: {
                    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                    windowStart = monthStart;
                    break;
                }
            }
        }
        const dateFilter = windowStart
            ? { gte: windowStart, ...(windowEnd ? { lt: windowEnd } : {}) }
            : {};
        const [totalContacts, periodContacts, recentContacts, prevPeriodCount, currentPeriodCount,] = await Promise.all([
            prisma.contact.count(),
            prisma.contact.count({ where: { createdAt: dateFilter } }),
            prisma.contact.findMany({
                take: 10,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            role: true,
                            profile: {
                                select: {
                                    avatarUrl: true,
                                },
                            },
                        }
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.contact.count({
                where: {
                    createdAt: {
                        gte: new Date(now.getTime() - 2 * 30 * 24 * 60 * 60 * 1000),
                        lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
                    },
                },
            }),
            prisma.contact.count({
                where: {
                    createdAt: {
                        gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
                    },
                },
            }),
        ]);
        const growthRate = prevPeriodCount > 0
            ? Math.round(((currentPeriodCount - prevPeriodCount) / prevPeriodCount) * 10000) / 100
            : 0;
        const groupByFormat = period === "yearly" ? "YYYY-MM" : "YYYY-MM-DD";
        const grouped = await prisma.$queryRawUnsafe(period === "yearly"
            ? `
          SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') as period,
                 COUNT(*)::int as count
          FROM contacts
          ${windowStart ? `WHERE "createdAt" >= $1` : ""}
          ${windowEnd ? ` AND "createdAt" < $2` : ""}
          GROUP BY 1
          ORDER BY 1 ASC
        `
            : `
          SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') as period,
                 COUNT(*)::int as count
          FROM contacts
          ${windowStart ? `WHERE "createdAt" >= $1` : ""}
          ${windowEnd ? ` AND "createdAt" < $2` : ""}
          GROUP BY 1
          ORDER BY 1 ASC
        `, ...(windowStart && windowEnd
            ? [windowStart, windowEnd]
            : windowStart
                ? [windowStart]
                : []));
        return {
            totalContacts,
            pendingContacts: 0,
            inProgressContacts: 0,
            completedContacts: 0,
            monthlyGrowth: growthRate,
            periodData: grouped,
        };
    }
}
exports.ContactService = ContactService;
//# sourceMappingURL=contact.service.js.map