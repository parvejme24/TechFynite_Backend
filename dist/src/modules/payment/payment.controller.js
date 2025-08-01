"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPaymentHistory = exports.getPaymentStatus = exports.fastspringWebhook = exports.checkout = void 0;
const payment_service_1 = require("./payment.service");
const checkout = async (req, res) => {
    try {
        // Redirect to new LemonSqueezy checkout system
        res.status(410).json({
            error: "FastSpring checkout is deprecated. Please use the new checkout system at /api/v1/checkout/:templateId",
            message: "Use POST /api/v1/checkout/:templateId with email and name in body"
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to initiate payment" });
    }
};
exports.checkout = checkout;
const fastspringWebhook = async (req, res) => {
    try {
        // Redirect to new LemonSqueezy webhook system
        res.status(410).json({
            error: "FastSpring webhook is deprecated. Please use the new webhook system at /api/v1/webhook/lemonsqueezy",
            message: "LemonSqueezy webhooks are now handled at /api/v1/webhook/lemonsqueezy"
        });
    }
    catch (error) {
        res.status(500).json({ error: "Webhook processing failed" });
    }
};
exports.fastspringWebhook = fastspringWebhook;
// New payment status endpoint
const getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const status = await payment_service_1.PaymentService.getPaymentStatus(orderId);
        if (!status) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(status);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get payment status" });
    }
};
exports.getPaymentStatus = getPaymentStatus;
// New user payment history endpoint
const getUserPaymentHistory = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const history = await payment_service_1.PaymentService.getUserPaymentHistory(userId);
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get payment history" });
    }
};
exports.getUserPaymentHistory = getUserPaymentHistory;
