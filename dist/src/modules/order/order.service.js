"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const database_1 = require("../../config/database");
exports.OrderService = {
    getUserOrders: async (userId) => {
        return database_1.prisma.orderInvoice.findMany({
            where: { userId },
            include: {
                template: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        imageUrl: true,
                        shortDescription: true,
                    }
                },
                license: {
                    select: {
                        id: true,
                        licenseKey: true,
                        isValid: true,
                        expiresAt: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },
    getOrderById: async (orderId, userId) => {
        return database_1.prisma.orderInvoice.findFirst({
            where: {
                id: orderId,
                userId
            },
            include: {
                template: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        imageUrl: true,
                        shortDescription: true,
                        description: true,
                        whatsIncluded: true,
                        keyFeatures: true,
                        sourceFiles: true,
                    }
                },
                license: {
                    select: {
                        id: true,
                        licenseKey: true,
                        isValid: true,
                        expiresAt: true,
                    }
                }
            }
        });
    },
    getTemplateDownload: async (templateId, userId) => {
        // Check if user has purchased this template
        const order = await database_1.prisma.orderInvoice.findFirst({
            where: {
                templateId,
                userId,
                paymentStatus: 'COMPLETED',
                status: 'CONFIRMED'
            },
            include: {
                template: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        sourceFiles: true,
                        shortDescription: true,
                    }
                },
                license: {
                    select: {
                        id: true,
                        licenseKey: true,
                        isValid: true,
                    }
                }
            }
        });
        if (!order) {
            return null;
        }
        return {
            template: order.template,
            downloadUrls: order.template.sourceFiles,
            license: order.license,
            orderId: order.orderId,
            purchaseDate: order.createdAt,
        };
    },
};
