"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userEmailParamsSchema = exports.contactParamsSchema = exports.createContactReplySchema = exports.contactQuerySchema = exports.updateContactSchema = exports.createContactSchema = void 0;
const zod_1 = require("zod");
exports.createContactSchema = zod_1.z.object({
    body: zod_1.z.object({
        projectDetails: zod_1.z.string().min(10, "Project details must be at least 10 characters"),
        budget: zod_1.z.string().min(1, "Budget is required"),
        fullName: zod_1.z.string().min(2, "Full name must be at least 2 characters"),
        email: zod_1.z.string().email("Invalid email format"),
        companyName: zod_1.z.string().min(1, "Company name is required"),
        serviceRequired: zod_1.z.string().min(1, "Service required is mandatory"),
        userId: zod_1.z.string().uuid().optional(),
    }),
});
exports.updateContactSchema = zod_1.z.object({
    body: zod_1.z.object({
        projectDetails: zod_1.z.string().min(10, "Project details must be at least 10 characters").optional(),
        budget: zod_1.z.string().min(1, "Budget is required").optional(),
        fullName: zod_1.z.string().min(2, "Full name must be at least 2 characters").optional(),
        email: zod_1.z.string().email("Invalid email format").optional(),
        companyName: zod_1.z.string().min(1, "Company name is required").optional(),
        serviceRequired: zod_1.z.string().min(1, "Service required is mandatory").optional(),
    }),
});
exports.contactQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1)).optional(),
        limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1).max(100)).optional(),
        search: zod_1.z.string().optional(),
        userId: zod_1.z.string().uuid().optional(),
        email: zod_1.z.string().email().optional(),
        sortBy: zod_1.z.enum(['createdAt', 'fullName', 'email']).optional(),
        sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    }),
});
exports.createContactReplySchema = zod_1.z.object({
    body: zod_1.z.object({
        subject: zod_1.z.string().min(1, "Subject is required"),
        message: zod_1.z.string().min(10, "Message must be at least 10 characters"),
        userEmail: zod_1.z.string().optional(),
        userName: zod_1.z.string().optional(),
        userId: zod_1.z.string().optional(),
    }),
});
exports.contactParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid contact ID format"),
    }),
});
exports.userEmailParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        userEmail: zod_1.z.string().email("Invalid email format"),
    }),
});
//# sourceMappingURL=contact.type.js.map