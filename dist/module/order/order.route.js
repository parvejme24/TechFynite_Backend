"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const order_validate_1 = require("./order.validate");
const router = (0, express_1.Router)();
router.get('/orders', order_validate_1.validateOrderQuery, order_controller_1.getAllOrders);
router.get('/orders/stats', order_controller_1.getOrderStats);
router.get('/orders/:id', order_validate_1.validateOrderId, order_controller_1.getOrderById);
router.get('/user/orders', authMiddleware_1.authenticateUser, order_validate_1.validateOrderQuery, order_controller_1.getUserOrders);
router.post('/orders', authMiddleware_1.authenticateAdminAndCheckStatus, order_validate_1.validateCreateOrder, order_controller_1.createOrder);
router.patch('/orders/:id/status', authMiddleware_1.authenticateAdminAndCheckStatus, order_validate_1.validateOrderId, order_validate_1.validateUpdateOrderStatus, order_controller_1.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=order.route.js.map