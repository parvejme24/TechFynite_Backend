"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQuerySchema = exports.orderIdSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    templateId: zod_1.z.string().uuid("Invalid template ID"),
    lemonsqueezyOrderId: zod_1.z.string().min(1, "Lemon Squeezy order ID is required"),
    lemonsqueezyInvoiceId: zod_1.z.string().optional(),
    totalAmount: zod_1.z.number().positive("Total amount must be positive"),
    currency: zod_1.z.string().default("USD"),
    licenseType: zod_1.z.enum(["SINGLE", "EXTENDED"]),
    paymentMethod: zod_1.z.string().optional(),
    customerEmail: zod_1.z.string().email("Invalid email address"),
    customerName: zod_1.z.string().optional(),
    billingAddress: zod_1.z.any().optional(),
    downloadLinks: zod_1.z.array(zod_1.z.string()).optional(),
    expiresAt: zod_1.z.string().datetime().optional(),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED"]),
});
exports.orderIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid order ID"),
});
exports.orderQuerySchema = zod_1.z.object({
    page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).default(1),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive().max(100)).default(10),
    status: zod_1.z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED"]).optional(),
    userId: zod_1.z.string().uuid().optional(),
    templateId: zod_1.z.string().uuid().optional(),
    sortBy: zod_1.z.enum(["createdAt", "totalAmount", "status"]).default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
//# sourceMappingURL=order.type.js.map