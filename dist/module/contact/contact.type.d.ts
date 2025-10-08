import { z } from "zod";
export declare const contactFormSchema: z.ZodObject<{
    projectDetails: z.ZodString;
    budget: z.ZodString;
    fullName: z.ZodString;
    email: z.ZodString;
    companyName: z.ZodString;
    serviceRequired: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const contactReplySchema: z.ZodObject<{
    subject: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
export declare const contactIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const contactQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    status: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        IN_PROGRESS: "IN_PROGRESS";
        COMPLETED: "COMPLETED";
    }>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type ContactReplyInput = z.infer<typeof contactReplySchema>;
export type ContactIdParams = z.infer<typeof contactIdSchema>;
export type ContactQueryParams = z.infer<typeof contactQuerySchema>;
export interface Contact {
    id: string;
    projectDetails: string;
    budget: string;
    fullName: string;
    email: string;
    companyName: string;
    serviceRequired: string;
    userId?: string | null;
    createdAt: Date;
    updatedAt: Date;
    user?: {
        id: string;
        fullName: string;
        email: string;
        role: string;
        profile?: {
            avatarUrl: string | null;
        } | null;
    } | null;
    replies?: ContactReply[];
}
export interface ContactReply {
    id: string;
    subject: string;
    message: string;
    contactId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    contact?: Contact | null;
    user?: {
        id: string;
        fullName: string;
        email: string;
        role: string;
        profile?: {
            avatarUrl: string | null;
        } | null;
    } | null;
}
export interface ContactStats {
    totalContacts: number;
    pendingContacts: number;
    inProgressContacts: number;
    completedContacts: number;
    recentContacts: Contact[];
    monthlyGrowth: number;
}
export interface PaginatedContacts {
    contacts: Contact[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
//# sourceMappingURL=contact.type.d.ts.map