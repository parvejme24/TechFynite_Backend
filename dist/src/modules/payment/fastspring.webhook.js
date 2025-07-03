"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastspringWebhook = void 0;
const fastspringWebhook = (req, res) => {
    // TODO: Validate webhook secret if needed
    // TODO: Process webhook event (update order/payment status, etc.)
    console.log('FastSpring Webhook received:', req.body);
    res.status(200).send('OK');
};
exports.fastspringWebhook = fastspringWebhook;
