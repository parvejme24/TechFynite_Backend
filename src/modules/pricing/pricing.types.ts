import { z } from 'zod';

// Zod validation schemas
export const createPricingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.number().positive('Price must be positive'),
  license: z.string().min(1, 'License is required'),
  recommended: z.boolean().optional().default(false),
  duration: z.enum(['MONTHLY', 'YEARLY', 'HALFYEARLY']),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
});

export const updatePricingSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  price: z.number().positive('Price must be positive').optional(),
  license: z.string().min(1, 'License is required').optional(),
  recommended: z.boolean().optional(),
  duration: z.enum(['MONTHLY', 'YEARLY', 'HALFYEARLY']).optional(),
  features: z.array(z.string()).min(1, 'At least one feature is required').optional(),
});

// TypeScript interfaces
export interface CreatePricingRequest {
  title: string;
  price: number;
  license: string;
  recommended?: boolean;
  duration: 'MONTHLY' | 'YEARLY' | 'HALFYEARLY';
  features: string[];
}

export interface UpdatePricingRequest {
  title?: string;
  price?: number;
  license?: string;
  recommended?: boolean;
  duration?: 'MONTHLY' | 'YEARLY' | 'HALFYEARLY';
  features?: string[];
}

export interface PricingResponse {
  id: string;
  title: string;
  price: number;
  license: string;
  recommended: boolean;
  duration: 'MONTHLY' | 'YEARLY' | 'HALFYEARLY';
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingListResponse {
  success: boolean;
  data: PricingResponse[];
}

export interface PricingDetailResponse {
  success: boolean;
  data: PricingResponse;
} 