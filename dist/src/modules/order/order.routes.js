"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// User order routes (require authentication)
router.get('/user/orders', auth_1.authMiddleware, order_controller_1.getUserOrders);
router.get('/user/orders/:id', auth_1.authMiddleware, order_controller_1.getOrderById);
router.get('/user/download/:templateId', auth_1.authMiddleware, order_controller_1.getTemplateDownload);
exports.default = router;
