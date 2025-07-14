"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const order_model_1 = require("./order.model");
const notification_model_1 = require("../notification/notification.model");
const auth_utils_1 = require("../auth/auth.utils");
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.OrderService = {
    create: async (data) => {
        // Create order
        const order = await order_model_1.OrderModel.create({
            ...data,
            orderId: crypto.randomUUID(),
            invoiceNumber: 'INV-' + Date.now(),
            invoiceDate: new Date(),
            paymentStatus: 'PENDING',
            status: 'PENDING',
            isDelivered: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        // Send notification
        await notification_model_1.NotificationModel.create({
            userId: data.userId,
            type: 'PAYMENT_CONFIRMED',
            message: `Order placed for template: ${data.templateName}`,
        });
        // Send invoice email
        await (0, auth_utils_1.sendEmail)(data.userEmail, 'Order Invoice', `Thank you for your order!\nOrder ID: ${order.orderId}\nTemplate: ${data.templateName}\nTotal: $${data.totalPrice}`);
        return order;
    },
    update: async (id, data) => {
        const order = await order_model_1.OrderModel.update(id, { ...data, updatedAt: new Date() });
        // Send notifications based on status
        if (data.status === 'CANCELLED') {
            await notification_model_1.NotificationModel.create({
                userId: order.userId,
                type: 'ACCOUNT_UPDATE',
                message: `Order cancelled for template: ${order.templateName}`,
            });
        }
        if (data.status === 'DELIVERED') {
            await notification_model_1.NotificationModel.create({
                userId: order.userId,
                type: 'TEMPLATE_DELIVERED',
                message: `Order delivered for template: ${order.templateName}`,
            });
            // Send download link via email if delivery method is DOWNLOAD
            if (order.deliveryMethod === 'DOWNLOAD' && order.deliveryUrl) {
                await (0, auth_utils_1.sendEmail)(order.userEmail, 'Your Template Download', `Your template is ready! Download here: ${order.deliveryUrl}`);
            }
        }
        return order;
    },
    getById: (id) => order_model_1.OrderModel.findById(id),
    getAll: () => order_model_1.OrderModel.findAll(),
    delete: (id) => order_model_1.OrderModel.delete(id),
    getAllByUserId: (userId) => order_model_1.OrderModel.findByUserId(userId),
    createFromPayment: async (webhookData) => {
        // Map FastSpring webhook data to your order fields
        const orderData = {
            userId: webhookData.data.userId, // You may need to map this properly
            templateId: webhookData.data.templateId,
            templateName: webhookData.data.productName,
            templateThumbnail: webhookData.data.productThumbnail,
            templatePrice: webhookData.data.productPrice,
            totalPrice: webhookData.data.totalPrice,
            paymentMethod: webhookData.data.paymentMethod,
            paymentStatus: 'COMPLETED',
            transactionId: webhookData.data.transactionId,
            status: 'CONFIRMED',
            isDelivered: false,
            deliveryMethod: webhookData.data.deliveryMethod,
            deliveryUrl: webhookData.data.deliveryUrl,
            invoiceNumber: webhookData.data.invoiceNumber,
            invoiceDate: new Date(webhookData.data.invoiceDate),
            userEmail: webhookData.data.userEmail,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return await order_model_1.OrderModel.create(orderData);
    },
};
