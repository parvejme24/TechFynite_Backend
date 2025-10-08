"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.licenseQuerySchema = exports.licenseIdSchema = exports.revokeLicenseSchema = exports.validateLicenseSchema = void 0;
const zod_1 = require("zod");
exports.validateLicenseSchema = zod_1.z.object({
    licenseKey: zod_1.z.string().min(1, "License key is required"),
});
exports.revokeLicenseSchema = zod_1.z.object({
    reason: zod_1.z.string().optional(),
});
exports.licenseIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid license ID"),
});
exports.licenseQuerySchema = zod_1.z.object({
    page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).default(1),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive().max(100)).default(10),
    userId: zod_1.z.string().uuid().optional(),
    templateId: zod_1.z.string().uuid().optional(),
    licenseType: zod_1.z.enum(["SINGLE", "EXTENDED"]).optional(),
    isActive: zod_1.z.string().transform(Boolean).optional(),
    sortBy: zod_1.z.enum(["createdAt", "expiresAt", "usedCount"]).default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
//# sourceMappingURL=license.type.js.map