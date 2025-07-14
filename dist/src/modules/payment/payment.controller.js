"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastspringWebhook = exports.checkout = void 0;
const payment_service_1 = require("./payment.service");
const checkout = async (req, res) => {
    try {
        const session = (await payment_service_1.PaymentService.createFastSpringSession(req.body));
        res.json({ url: session.url });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to initiate payment" });
    }
};
exports.checkout = checkout;
const fastspringWebhook = async (req, res) => {
    try {
        await payment_service_1.PaymentService.handleFastSpringWebhook(req.body);
        res.status(200).send("OK");
    }
    catch (error) {
        res.status(500).json({ error: "Webhook processing failed" });
    }
};
exports.fastspringWebhook = fastspringWebhook;
