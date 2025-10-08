import { z } from "zod";
export declare const newsletterSubscriptionSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export declare const newsletterStatsSchema: z.ZodObject<{
    period: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        daily: "daily";
        weekly: "weekly";
        monthly: "monthly";
        yearly: "yearly";
    }>>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const newsletterIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type NewsletterSubscriptionInput = z.infer<typeof newsletterSubscriptionSchema>;
export type NewsletterStatsQuery = z.infer<typeof newsletterStatsSchema>;
export type NewsletterIdParams = z.infer<typeof newsletterIdSchema>;
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
//# sourceMappingURL=newsletter.type.d.ts.map