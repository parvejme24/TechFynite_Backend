"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lemonsqueezy_webhook_controller_1 = require("./lemonsqueezy.webhook.controller");
const router = (0, express_1.Router)();
router.post('/webhook/lemonsqueezy', lemonsqueezy_webhook_controller_1.handleLemonSqueezyWebhook);
exports.default = router;
