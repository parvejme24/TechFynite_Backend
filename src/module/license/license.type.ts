import { z } from "zod";

// License validation schemas
export const validateLicenseSchema = z.object({
  licenseKey: z.string().min(1, "License key is required"),
});

export const revokeLicenseSchema = z.object({
  reason: z.string().optional(),
});

export const licenseIdSchema = z.object({
  id: z.string().uuid("Invalid license ID"),
});

export const licenseQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default(1),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default(10),
  userId: z.string().uuid().optional(),
  templateId: z.string().uuid().optional(),
  licenseType: z.enum(["SINGLE", "EXTENDED"]).optional(),
  isActive: z.string().transform(Boolean).optional(),
  sortBy: z.enum(["createdAt", "expiresAt", "usedCount"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// License interfaces
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
