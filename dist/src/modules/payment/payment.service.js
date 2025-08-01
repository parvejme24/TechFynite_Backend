"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const database_1 = require("../../config/database");
exports.PaymentService = {
    // Legacy FastSpring methods (kept for backward compatibility)
    createFastSpringSession: async (data) => {
        console.warn('FastSpring integration is deprecated. Please use LemonSqueezy instead.');
        throw new Error('FastSpring integration is deprecated. Please use LemonSqueezy instead.');
    },
    handleFastSpringWebhook: async (webhookData) => {
        console.warn('FastSpring webhook is deprecated. Please use LemonSqueezy webhook instead.');
        throw new Error('FastSpring webhook is deprecated. Please use LemonSqueezy webhook instead.');
    },
    // New LemonSqueezy methods
    getPaymentStatus: async (orderId) => {
        try {
            const order = await database_1.prisma.orderInvoice.findUnique({
                where: { orderId },
                select: {
                    paymentStatus: true,
                    status: true,
                    totalPrice: true,
                    templateName: true,
                    userEmail: true,
                }
            });
            return order;
        }
        catch (error) {
            console.error('Error getting payment status:', error);
            throw error;
        }
    },
    getUserPaymentHistory: async (userId) => {
        try {
            const payments = await database_1.prisma.orderInvoice.findMany({
                where: { userId },
                select: {
                    orderId: true,
                    templateName: true,
                    totalPrice: true,
                    paymentStatus: true,
                    status: true,
                    createdAt: true,
                    template: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            imageUrl: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return payments;
        }
        catch (error) {
            console.error('Error getting user payment history:', error);
            throw error;
        }
    },
};
