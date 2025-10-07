import { z } from "zod";

// Newsletter subscription schema
export const newsletterSubscriptionSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
});

// Newsletter stats query schema
export const newsletterStatsSchema = z.object({
  period: z.enum(["daily", "weekly", "monthly", "yearly"]).optional().default("monthly"),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Newsletter ID parameter schema
export const newsletterIdSchema = z.object({
  id: z.string().uuid("Invalid newsletter ID format"),
});

// Types
export type NewsletterSubscriptionInput = z.infer<typeof newsletterSubscriptionSchema>;
export type NewsletterStatsQuery = z.infer<typeof newsletterStatsSchema>;
export type NewsletterIdParams = z.infer<typeof newsletterIdSchema>;

// Newsletter response types
export interface NewsletterSubscriber {
  id: string;
  email: string;
  userId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  } | null;
}

export interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  inactiveSubscribers: number;
  periodData: {
    period: string;
    count: number;
    date: string;
  }[];
  growthRate: number;
  unsubscribeRate: number;
}
