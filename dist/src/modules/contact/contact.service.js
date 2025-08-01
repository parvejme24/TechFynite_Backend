"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const prisma_1 = require("../../generated/prisma");
const auth_utils_1 = require("../auth/auth.utils");
const prisma = new prisma_1.PrismaClient();
class ContactService {
    static async create(data, userId) {
        try {
            const contact = await prisma.contact.create({
                data: {
                    projectDetails: data.projectDetails,
                    budget: data.budget,
                    fullName: data.fullName,
                    email: data.email,
                    companyName: data.companyName,
                    serviceRequred: data.serviceRequred,
                    userId: userId,
                },
            });
            // Optionally send an email notification to admin
            try {
                await (0, auth_utils_1.sendEmail)(process.env.CONTACT_NOTIFY_EMAIL || 'parvej@techfynite.com', 'New Contact Form Submission', `New contact form submitted by ${data.fullName} (${data.email})\n\nProject Details: ${data.projectDetails}\nBudget: ${data.budget}\nCompany: ${data.companyName}\nService: ${data.serviceRequred}`);
            }
            catch (e) {
                // Log but don't fail the request
                console.error('Failed to send contact notification email:', e);
            }
            return contact;
        }
        catch (error) {
            throw new Error(`Failed to create contact: ${error}`);
        }
    }
    static async getAll(options) {
        try {
            const page = options?.page && options.page > 0 ? options.page : 1;
            const pageSize = options?.pageSize && options.pageSize > 0 ? options.pageSize : 9;
            const skip = (page - 1) * pageSize;
            // Build where clause for filtering
            const where = {};
            if (options?.serviceRequred) {
                where.serviceRequred = options.serviceRequred;
            }
            if (options?.fromDate || options?.toDate) {
                where.createdAt = {};
                if (options.fromDate) {
                    where.createdAt.gte = new Date(options.fromDate);
                }
                if (options.toDate) {
                    where.createdAt.lte = new Date(options.toDate);
                }
            }
            // Get total count
            const total = await prisma.contact.count({ where });
            // Get contacts with pagination
            let contacts = await prisma.contact.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    displayName: true,
                                    email: true,
                                    role: true
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });
            // Apply keyword search if provided
            if (options?.keyword) {
                const keyword = options.keyword.toLowerCase();
                contacts = contacts.filter(c => c.projectDetails.toLowerCase().includes(keyword) ||
                    c.budget.toLowerCase().includes(keyword) ||
                    c.fullName.toLowerCase().includes(keyword) ||
                    c.email.toLowerCase().includes(keyword) ||
                    c.companyName.toLowerCase().includes(keyword) ||
                    c.serviceRequred.toLowerCase().includes(keyword));
            }
            return {
                data: contacts,
                total: options?.keyword ? contacts.length : total
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch contacts: ${error}`);
        }
    }
    static async getById(id) {
        try {
            const contact = await prisma.contact.findUnique({
                where: { id },
                include: {
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    displayName: true,
                                    email: true,
                                    role: true
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });
            return contact;
        }
        catch (error) {
            throw new Error(`Failed to fetch contact: ${error}`);
        }
    }
    static async updateStatus(id, data) {
        try {
            const contact = await prisma.contact.update({
                where: { id },
                data: {
                    status: data.status,
                },
            });
            return contact;
        }
        catch (error) {
            throw new Error(`Failed to update contact status: ${error}`);
        }
    }
    static async delete(id) {
        try {
            await prisma.contact.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            throw new Error(`Failed to delete contact: ${error}`);
        }
    }
    static async contactExists(id) {
        try {
            const count = await prisma.contact.count({
                where: { id },
            });
            return count > 0;
        }
        catch (error) {
            throw new Error(`Failed to check contact existence: ${error}`);
        }
    }
    static async getContactsByIds(ids) {
        try {
            const contacts = await prisma.contact.findMany({
                where: { id: { in: ids } },
                include: {
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    displayName: true,
                                    email: true,
                                    role: true
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });
            return contacts;
        }
        catch (error) {
            throw new Error(`Failed to fetch contacts by IDs: ${error}`);
        }
    }
    static async getByUserId(userId) {
        try {
            const contacts = await prisma.contact.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                include: {
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    displayName: true,
                                    email: true,
                                    role: true
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });
            return contacts;
        }
        catch (error) {
            throw new Error(`Failed to fetch user contacts: ${error}`);
        }
    }
    static async update(id, data) {
        try {
            const contact = await prisma.contact.update({
                where: { id },
                data: {
                    ...data,
                    updatedAt: new Date(),
                },
            });
            return contact;
        }
        catch (error) {
            throw new Error(`Failed to update contact: ${error}`);
        }
    }
    // ContactReply functionality
    static async addReply(contactId, userId, subject, message) {
        try {
            const reply = await prisma.contactReply.create({
                data: {
                    contactId,
                    userId,
                    subject,
                    message,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            displayName: true,
                            email: true,
                            role: true
                        }
                    }
                }
            });
            return reply;
        }
        catch (error) {
            throw new Error(`Failed to add reply: ${error}`);
        }
    }
    static async getReplies(contactId) {
        try {
            const replies = await prisma.contactReply.findMany({
                where: { contactId },
                include: {
                    user: {
                        select: {
                            id: true,
                            displayName: true,
                            email: true,
                            role: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            return replies;
        }
        catch (error) {
            throw new Error(`Failed to fetch replies: ${error}`);
        }
    }
    static async deleteReply(replyId) {
        try {
            await prisma.contactReply.delete({
                where: { id: replyId },
            });
            return true;
        }
        catch (error) {
            throw new Error(`Failed to delete reply: ${error}`);
        }
    }
}
exports.ContactService = ContactService;
