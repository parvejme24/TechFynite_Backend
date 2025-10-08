import { z } from "zod";
export declare const lemonsqueezyWebhookSchema: z.ZodObject<{
    meta: z.ZodObject<{
        event_name: z.ZodString;
        custom_data: z.ZodOptional<z.ZodAny>;
    }, z.core.$strip>;
    data: z.ZodObject<{
        type: z.ZodString;
        id: z.ZodString;
        attributes: z.ZodObject<{
            store_id: z.ZodNumber;
            customer_id: z.ZodNumber;
            order_number: z.ZodNumber;
            user_name: z.ZodString;
            user_email: z.ZodString;
            status: z.ZodString;
            status_formatted: z.ZodString;
            refunded: z.ZodBoolean;
            refunded_at: z.ZodNullable<z.ZodString>;
            subtotal: z.ZodNumber;
            discount_total: z.ZodNumber;
            tax: z.ZodNumber;
            total: z.ZodNumber;
            subtotal_usd: z.ZodNumber;
            discount_total_usd: z.ZodNumber;
            tax_usd: z.ZodNumber;
            total_usd: z.ZodNumber;
            subtotal_formatted: z.ZodString;
            discount_total_formatted: z.ZodString;
            tax_formatted: z.ZodString;
            total_formatted: z.ZodString;
            first_order_item: z.ZodObject<{
                id: z.ZodNumber;
                order_id: z.ZodNumber;
                product_id: z.ZodNumber;
                variant_id: z.ZodNumber;
                product_name: z.ZodString;
                variant_name: z.ZodString;
                price: z.ZodNumber;
                created_at: z.ZodString;
                updated_at: z.ZodString;
            }, z.core.$strip>;
            urls: z.ZodObject<{
                receipt: z.ZodString;
            }, z.core.$strip>;
            created_at: z.ZodString;
            updated_at: z.ZodString;
        }, z.core.$strip>;
        relationships: z.ZodObject<{
            store: z.ZodObject<{
                data: z.ZodObject<{
                    type: z.ZodString;
                    id: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
            customer: z.ZodObject<{
                data: z.ZodObject<{
                    type: z.ZodString;
                    id: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
            "order-items": z.ZodObject<{
                data: z.ZodArray<z.ZodObject<{
                    type: z.ZodString;
                    id: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>;
            subscriptions: z.ZodObject<{
                data: z.ZodArray<z.ZodAny>;
            }, z.core.$strip>;
            license_keys: z.ZodObject<{
                data: z.ZodArray<z.ZodObject<{
                    type: z.ZodString;
                    id: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
export interface LemonSqueezyWebhookPayload {
    meta: {
        event_name: string;
        custom_data?: any;
    };
    data: {
        type: string;
        id: string;
        attributes: {
            store_id: number;
            customer_id: number;
            order_number: number;
            user_name: string;
            user_email: string;
            status: string;
            status_formatted: string;
            refunded: boolean;
            refunded_at: string | null;
            subtotal: number;
            discount_total: number;
            tax: number;
            total: number;
            subtotal_usd: number;
            discount_total_usd: number;
            tax_usd: number;
            total_usd: number;
            subtotal_formatted: string;
            discount_total_formatted: string;
            tax_formatted: string;
            total_formatted: string;
            first_order_item: {
                id: number;
                order_id: number;
                product_id: number;
                variant_id: number;
                product_name: string;
                variant_name: string;
                price: number;
                created_at: string;
                updated_at: string;
            };
            urls: {
                receipt: string;
            };
            created_at: string;
            updated_at: string;
        };
        relationships: {
            store: {
                data: {
                    type: string;
                    id: string;
                };
            };
            customer: {
                data: {
                    type: string;
                    id: string;
                };
            };
            "order-items": {
                data: Array<{
                    type: string;
                    id: string;
                }>;
            };
            subscriptions: {
                data: any[];
            };
            license_keys: {
                data: Array<{
                    type: string;
                    id: string;
                }>;
            };
        };
    };
}
export interface WebhookProcessingResult {
    success: boolean;
    message: string;
    orderId?: string;
    licenseIds?: string[];
    error?: string;
}
//# sourceMappingURL=webhook.type.d.ts.map