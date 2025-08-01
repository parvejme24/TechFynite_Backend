"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_controller_1 = require("./checkout.controller");
const router = (0, express_1.Router)();
router.post('/checkout/:templateId', checkout_controller_1.createCheckoutLink);
exports.default = router;
