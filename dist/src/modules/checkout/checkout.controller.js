"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutLink = void 0;
const checkout_service_1 = require("./checkout.service");
const createCheckoutLink = async (req, res) => {
    try {
        const { templateId } = req.params;
        const { email, name } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const checkoutData = await checkout_service_1.CheckoutService.createCheckoutLink(templateId, email, name);
        res.json(checkoutData);
    }
    catch (error) {
        console.error('Create checkout link error:', error);
        res.status(500).json({
            error: 'Failed to create checkout link',
            details: error instanceof Error ? error.message : error
        });
    }
};
exports.createCheckoutLink = createCheckoutLink;
