"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePricingSchema = exports.createPricingSchema = void 0;
const zod_1 = require("zod");
// Zod validation schemas
exports.createPricingSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    price: zod_1.z.number().positive('Price must be positive'),
    license: zod_1.z.string().min(1, 'License is required'),
    recommended: zod_1.z.boolean().optional().default(false),
    duration: zod_1.z.enum(['MONTHLY', 'YEARLY', 'HALFYEARLY']),
    features: zod_1.z.array(zod_1.z.string()).min(1, 'At least one feature is required'),
});
exports.updatePricingSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').optional(),
    price: zod_1.z.number().positive('Price must be positive').optional(),
    license: zod_1.z.string().min(1, 'License is required').optional(),
    recommended: zod_1.z.boolean().optional(),
    duration: zod_1.z.enum(['MONTHLY', 'YEARLY', 'HALFYEARLY']).optional(),
    features: zod_1.z.array(zod_1.z.string()).min(1, 'At least one feature is required').optional(),
});
