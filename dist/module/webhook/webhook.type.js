"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lemonsqueezyWebhookSchema = void 0;
const zod_1 = require("zod");
exports.lemonsqueezyWebhookSchema = zod_1.z.object({
    meta: zod_1.z.object({
        event_name: zod_1.z.string(),
        custom_data: zod_1.z.any().optional(),
    }),
    data: zod_1.z.object({
        type: zod_1.z.string(),
        id: zod_1.z.string(),
        attributes: zod_1.z.object({
            store_id: zod_1.z.number(),
            customer_id: zod_1.z.number(),
            order_number: zod_1.z.number(),
            user_name: zod_1.z.string(),
            user_email: zod_1.z.string(),
            status: zod_1.z.string(),
            status_formatted: zod_1.z.string(),
            refunded: zod_1.z.boolean(),
            refunded_at: zod_1.z.string().nullable(),
            subtotal: zod_1.z.number(),
            discount_total: zod_1.z.number(),
            tax: zod_1.z.number(),
            total: zod_1.z.number(),
            subtotal_usd: zod_1.z.number(),
            discount_total_usd: zod_1.z.number(),
            tax_usd: zod_1.z.number(),
            total_usd: zod_1.z.number(),
            subtotal_formatted: zod_1.z.string(),
            discount_total_formatted: zod_1.z.string(),
            tax_formatted: zod_1.z.string(),
            total_formatted: zod_1.z.string(),
            first_order_item: zod_1.z.object({
                id: zod_1.z.number(),
                order_id: zod_1.z.number(),
                product_id: zod_1.z.number(),
                variant_id: zod_1.z.number(),
                product_name: zod_1.z.string(),
                variant_name: zod_1.z.string(),
                price: zod_1.z.number(),
                created_at: zod_1.z.string(),
                updated_at: zod_1.z.string(),
            }),
            urls: zod_1.z.object({
                receipt: zod_1.z.string(),
            }),
            created_at: zod_1.z.string(),
            updated_at: zod_1.z.string(),
        }),
        relationships: zod_1.z.object({
            store: zod_1.z.object({
                data: zod_1.z.object({
                    type: zod_1.z.string(),
                    id: zod_1.z.string(),
                }),
            }),
            customer: zod_1.z.object({
                data: zod_1.z.object({
                    type: zod_1.z.string(),
                    id: zod_1.z.string(),
                }),
            }),
            "order-items": zod_1.z.object({
                data: zod_1.z.array(zod_1.z.object({
                    type: zod_1.z.string(),
                    id: zod_1.z.string(),
                })),
            }),
            subscriptions: zod_1.z.object({
                data: zod_1.z.array(zod_1.z.any()),
            }),
            license_keys: zod_1.z.object({
                data: zod_1.z.array(zod_1.z.object({
                    type: zod_1.z.string(),
                    id: zod_1.z.string(),
                })),
            }),
        }),
    }),
});
//# sourceMappingURL=webhook.type.js.map