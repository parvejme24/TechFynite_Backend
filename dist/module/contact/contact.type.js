"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactQuerySchema = exports.contactIdSchema = exports.contactReplySchema = exports.contactFormSchema = void 0;
const zod_1 = require("zod");
exports.contactFormSchema = zod_1.z.object({
    projectDetails: zod_1.z.string().min(10, "Project details must be at least 10 characters").max(1000, "Project details must not exceed 1000 characters"),
    budget: zod_1.z.string().min(1, "Budget is required").max(50, "Budget must not exceed 50 characters"),
    fullName: zod_1.z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name must not exceed 100 characters"),
    email: zod_1.z.string().email("Invalid email format").min(1, "Email is required"),
    companyName: zod_1.z.string().min(1, "Company name is required").max(100, "Company name must not exceed 100 characters"),
    serviceRequired: zod_1.z.string().min(1, "Service required is required").max(100, "Service required must not exceed 100 characters"),
    userId: zod_1.z.string().uuid().optional(),
});
exports.contactReplySchema = zod_1.z.object({
    subject: zod_1.z.string().min(1, "Subject is required").max(200, "Subject must not exceed 200 characters"),
    message: zod_1.z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must not exceed 2000 characters"),
});
exports.contactIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid contact ID format"),
});
exports.contactQuerySchema = zod_1.z.object({
    page: zod_1.z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
    limit: zod_1.z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
    status: zod_1.z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=contact.type.js.map