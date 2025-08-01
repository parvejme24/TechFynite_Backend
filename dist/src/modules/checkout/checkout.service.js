"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutService = void 0;
const database_1 = require("../../config/database");
const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
exports.CheckoutService = {
    createCheckoutLink: async (templateId, email, name) => {
        // Get template details
        const template = await database_1.prisma.template.findUnique({
            where: { id: templateId },
            include: { category: true }
        });
        if (!template) {
            throw new Error('Template not found');
        }
        if (!template.lemonsqueezyProductId || !template.lemonsqueezyVariantId) {
            throw new Error('Template not configured with LemonSqueezy');
        }
        // Create checkout session with LemonSqueezy
        const checkoutData = {
            data: {
                type: 'checkouts',
                attributes: {
                    store_id: 1, // You'll need to get your store ID from LemonSqueezy
                    variant_id: parseInt(template.lemonsqueezyVariantId),
                    custom_price: template.price * 100, // Convert to cents
                    product_options: {
                        name: template.title,
                        description: template.shortDescription,
                        redirect_url: `${process.env.FRONTEND_URL}/templates/${template.slug}`,
                        receipt_button_text: 'Download Template',
                        receipt_link_url: `${process.env.FRONTEND_URL}/templates/${template.slug}`,
                    },
                    checkout_options: {
                        embed: false,
                        media: false,
                        logo: false,
                    },
                    checkout_data: {
                        email: email,
                        name: name || '',
                        custom: {
                            template_id: templateId,
                            template_slug: template.slug,
                        },
                    },
                },
            },
        };
        const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LEMONSQUEEZY_API_KEY}`,
            },
            body: JSON.stringify(checkoutData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`LemonSqueezy API error: ${errorData.errors?.[0]?.detail || 'Unknown error'}`);
        }
        const result = await response.json();
        return {
            checkoutUrl: result.data.attributes.url,
            checkoutId: result.data.id,
            template: {
                id: template.id,
                title: template.title,
                price: template.price,
                slug: template.slug,
            },
        };
    },
};
