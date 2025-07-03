"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
router.post('/checkout', payment_controller_1.checkout);
router.post('/webhook', payment_controller_1.fastspringWebhook);
exports.default = router;
