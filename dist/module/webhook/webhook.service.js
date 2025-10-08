"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
class WebhookService {
    constructor() {
        this.LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    }
    verifyWebhookSignature(payload, signature) {
        if (!this.LEMONSQUEEZY_WEBHOOK_SECRET) {
            console.error("LEMONSQUEEZY_WEBHOOK_SECRET not configured");
            return false;
        }
        const expectedSignature = crypto_1.default
            .createHmac("sha256", this.LEMONSQUEEZY_WEBHOOK_SECRET)
            .update(payload)
            .digest("hex");
        return crypto_1.default.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"));
    }
    async processOrderCreated(payload) {
        try {
            const { data } = payload;
            const { attributes } = data;
            const existingOrder = await prisma.orderInvoice.findUnique({
                where: { lemonsqueezyOrderId: data.id },
            });
            if (existingOrder) {
                return {
                    success: true,
                    message: "Order already exists",
                    orderId: existingOrder.id,
                };
            }
            const template = await prisma.template.findFirst({
                where: {
                    OR: [
                        { lemonsqueezyProductId: attributes.first_order_item.product_id.toString() },
                        { lemonsqueezyVariantId: attributes.first_order_item.variant_id.toString() },
                    ],
                },
            });
            if (!template) {
                return {
                    success: false,
                    message: "Template not found for this product",
                    error: `No template found for product ID: ${attributes.first_order_item.product_id}`,
                };
            }
            let user = await prisma.user.findUnique({
                where: { email: attributes.user_email },
            });
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        fullName: attributes.user_name,
                        email: attributes.user_email,
                        role: "USER",
                    },
                });
            }
            const order = await prisma.orderInvoice.create({
                data: {
                    userId: user.id,
                    templateId: template.id,
                    lemonsqueezyOrderId: data.id,
                    lemonsqueezyInvoiceId: data.id,
                    status: this.mapLemonSqueezyStatus(attributes.status),
                    totalAmount: attributes.total_usd,
                    currency: "USD",
                    licenseType: this.determineLicenseType(attributes.first_order_item.variant_name),
                    paymentMethod: "Lemon Squeezy",
                    customerEmail: attributes.user_email,
                    customerName: attributes.user_name,
                    billingAddress: {
                        email: attributes.user_email,
                        name: attributes.user_name,
                    },
                    downloadLinks: [],
                },
            });
            const licenseKeys = await this.generateLicenseKeys(template.id, user.id, order.id, data.id);
            await prisma.orderInvoice.update({
                where: { id: order.id },
                data: {
                    downloadLinks: licenseKeys.map(license => license.licenseKey),
                },
            });
            await prisma.template.update({
                where: { id: template.id },
                data: { totalPurchase: { increment: 1 } },
            });
            return {
                success: true,
                message: "Order and licenses created successfully",
                orderId: order.id,
                licenseIds: licenseKeys.map(license => license.id),
            };
        }
        catch (error) {
            console.error("Error processing order created webhook:", error);
            return {
                success: false,
                message: "Failed to process order",
                error: error.message,
            };
        }
    }
    async processOrderUpdated(payload) {
        try {
            const { data } = payload;
            const { attributes } = data;
            const order = await prisma.orderInvoice.findUnique({
                where: { lemonsqueezyOrderId: data.id },
            });
            if (!order) {
                return {
                    success: false,
                    message: "Order not found",
                    error: `Order with Lemon Squeezy ID ${data.id} not found`,
                };
            }
            const updatedOrder = await prisma.orderInvoice.update({
                where: { id: order.id },
                data: {
                    status: this.mapLemonSqueezyStatus(attributes.status),
                },
            });
            if (attributes.refunded) {
                await prisma.license.updateMany({
                    where: { orderId: order.id },
                    data: { isActive: false },
                });
            }
            return {
                success: true,
                message: "Order updated successfully",
                orderId: updatedOrder.id,
            };
        }
        catch (error) {
            console.error("Error processing order updated webhook:", error);
            return {
                success: false,
                message: "Failed to process order update",
                error: error.message,
            };
        }
    }
    mapLemonSqueezyStatus(lsStatus) {
        switch (lsStatus.toLowerCase()) {
            case "pending":
                return "PENDING";
            case "processing":
                return "PROCESSING";
            case "completed":
                return "COMPLETED";
            case "cancelled":
                return "CANCELLED";
            case "refunded":
                return "REFUNDED";
            default:
                return "PENDING";
        }
    }
    determineLicenseType(variantName) {
        const lowerVariant = variantName.toLowerCase();
        if (lowerVariant.includes("extended") || lowerVariant.includes("commercial")) {
            return "EXTENDED";
        }
        return "SINGLE";
    }
    async generateLicenseKeys(templateId, userId, orderId, lemonsqueezyOrderId) {
        const licenses = [];
        const licenseCount = 1;
        for (let i = 0; i < licenseCount; i++) {
            const licenseKey = this.generateLicenseKey();
            const license = await prisma.license.create({
                data: {
                    orderId,
                    templateId,
                    userId,
                    licenseType: "SINGLE",
                    licenseKey,
                    lemonsqueezyOrderId,
                    isActive: true,
                    maxUsage: 1,
                    usedCount: 0,
                },
            });
            licenses.push(license);
        }
        return licenses;
    }
    generateLicenseKey() {
        const prefix = "TF";
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }
}
exports.WebhookService = WebhookService;
//# sourceMappingURL=webhook.service.js.map