"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLemonSqueezyWebhook = void 0;
const lemonsqueezy_webhook_service_1 = require("./lemonsqueezy.webhook.service");
const handleLemonSqueezyWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-signature'];
        const body = req.body;
        if (!signature) {
            return res.status(401).json({ error: 'Missing signature' });
        }
        // Verify webhook signature
        const isValid = lemonsqueezy_webhook_service_1.LemonSqueezyWebhookService.verifySignature(body, signature);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid signature' });
        }
        // Process the webhook
        const result = await lemonsqueezy_webhook_service_1.LemonSqueezyWebhookService.processWebhook(body);
        res.json({
            success: true,
            message: 'Webhook processed successfully',
            orderId: result.orderId
        });
    }
    catch (error) {
        console.error('LemonSqueezy webhook error:', error);
        res.status(500).json({
            error: 'Failed to process webhook',
            details: error instanceof Error ? error.message : error
        });
    }
};
exports.handleLemonSqueezyWebhook = handleLemonSqueezyWebhook;
