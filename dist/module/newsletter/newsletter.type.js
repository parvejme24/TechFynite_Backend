"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterIdSchema = exports.newsletterStatsSchema = exports.newsletterSubscriptionSchema = void 0;
const zod_1 = require("zod");
exports.newsletterSubscriptionSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format").min(1, "Email is required"),
});
exports.newsletterStatsSchema = zod_1.z.object({
    period: zod_1.z.enum(["daily", "weekly", "monthly", "yearly"]).optional().default("monthly"),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
});
exports.newsletterIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid newsletter ID format"),
});
//# sourceMappingURL=newsletter.type.js.map