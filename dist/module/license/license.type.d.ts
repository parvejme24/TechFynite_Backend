import { z } from "zod";
export declare const validateLicenseSchema: z.ZodObject<{
    licenseKey: z.ZodString;
}, z.core.$strip>;
export declare const revokeLicenseSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const licenseIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const licenseQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>, z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>, z.ZodNumber>>;
    userId: z.ZodOptional<z.ZodString>;
    templateId: z.ZodOptional<z.ZodString>;
    licenseType: z.ZodOptional<z.ZodEnum<{
        SINGLE: "SINGLE";
        EXTENDED: "EXTENDED";
    }>>;
    isActive: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<boolean, string>>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        expiresAt: "expiresAt";
        usedCount: "usedCount";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export interface License {
    id: string;
    orderId?: string | null;
    templateId: string;
    userId?: string | null;
    licenseType: "SINGLE" | "EXTENDED";
    licenseKey: string;
    activationLimit?: number | null;
    lemonsqueezyOrderId: string;
    isActive: boolean;
    maxUsage?: number | null;
    usedCount: number;
    expiresAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    order?: {
        id: string;
        status: string;
        totalAmount: number;
        customerEmail: string;
    } | null;
    template: {
        id: string;
        title: string;
        price: number;
        imageUrl?: string | null;
        shortDescription: string;
    };
    user?: {
        id: string;
        fullName: string;
        email: string;
    } | null;
}
export interface ValidateLicenseInput {
    licenseKey: string;
}
export interface RevokeLicenseInput {
    reason?: string;
}
export interface LicenseQuery {
    page: number;
    limit: number;
    userId?: string;
    templateId?: string;
    licenseType?: "SINGLE" | "EXTENDED";
    isActive?: boolean;
    sortBy: "createdAt" | "expiresAt" | "usedCount";
    sortOrder: "asc" | "desc";
}
export interface PaginatedLicenses {
    licenses: License[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export interface LicenseStats {
    totalLicenses: number;
    activeLicenses: number;
    expiredLicenses: number;
    licensesByType: Array<{
        licenseType: string;
        count: number;
        activeCount: number;
    }>;
    licensesByTemplate: Array<{
        templateId: string;
        templateName: string;
        licenseCount: number;
        activeCount: number;
    }>;
}
export interface LicenseValidationResult {
    isValid: boolean;
    license?: License;
    message: string;
    isExpired?: boolean;
    isRevoked?: boolean;
    remainingUsage?: number;
}
//# sourceMappingURL=license.type.d.ts.map