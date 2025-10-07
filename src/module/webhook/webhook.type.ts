import { z } from "zod";

// Lemon Squeezy webhook validation schemas
export const lemonsqueezyWebhookSchema = z.object({
  meta: z.object({
    event_name: z.string(),
    custom_data: z.any().optional(),
  }),
  data: z.object({
    type: z.string(),
    id: z.string(),
    attributes: z.object({
      store_id: z.number(),
      customer_id: z.number(),
      order_number: z.number(),
      user_name: z.string(),
      user_email: z.string(),
      status: z.string(),
      status_formatted: z.string(),
      refunded: z.boolean(),
      refunded_at: z.string().nullable(),
      subtotal: z.number(),
      discount_total: z.number(),
      tax: z.number(),
      total: z.number(),
      subtotal_usd: z.number(),
      discount_total_usd: z.number(),
      tax_usd: z.number(),
      total_usd: z.number(),
      subtotal_formatted: z.string(),
      discount_total_formatted: z.string(),
      tax_formatted: z.string(),
      total_formatted: z.string(),
      first_order_item: z.object({
        id: z.number(),
        order_id: z.number(),
        product_id: z.number(),
        variant_id: z.number(),
        product_name: z.string(),
        variant_name: z.string(),
        price: z.number(),
        created_at: z.string(),
        updated_at: z.string(),
      }),
      urls: z.object({
        receipt: z.string(),
      }),
      created_at: z.string(),
      updated_at: z.string(),
    }),
    relationships: z.object({
      store: z.object({
        data: z.object({
          type: z.string(),
          id: z.string(),
        }),
      }),
      customer: z.object({
        data: z.object({
          type: z.string(),
          id: z.string(),
        }),
      }),
      "order-items": z.object({
        data: z.array(z.object({
          type: z.string(),
          id: z.string(),
        })),
      }),
      subscriptions: z.object({
        data: z.array(z.any()),
      }),
      license_keys: z.object({
        data: z.array(z.object({
          type: z.string(),
          id: z.string(),
        })),
      }),
    }),
  }),
});

// Webhook interfaces
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
