"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// Legacy FastSpring routes (deprecated)
router.post('/checkout', payment_controller_1.checkout);
router.post('/webhook', payment_controller_1.fastspringWebhook);
// New payment routes
router.get('/payment/status/:orderId', payment_controller_1.getPaymentStatus);
router.get('/payment/history', auth_1.authMiddleware, payment_controller_1.getUserPaymentHistory);
exports.default = router;
