"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateDownload = exports.getOrderById = exports.getUserOrders = void 0;
const order_service_1 = require("./order.service");
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
        }
        const orders = await order_service_1.OrderService.getUserOrders(userId);
        res.json(orders);
    }
    catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ error: 'Failed to fetch user orders' });
    }
};
exports.getUserOrders = getUserOrders;
const getOrderById = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
        }
        const order = await order_service_1.OrderService.getOrderById(req.params.id, userId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    }
    catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};
exports.getOrderById = getOrderById;
const getTemplateDownload = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
        }
        const { templateId } = req.params;
        const downloadData = await order_service_1.OrderService.getTemplateDownload(templateId, userId);
        if (!downloadData) {
            return res.status(404).json({ error: 'Template not found or not purchased' });
        }
        res.json(downloadData);
    }
    catch (error) {
        console.error('Get template download error:', error);
        res.status(500).json({ error: 'Failed to get template download' });
    }
};
exports.getTemplateDownload = getTemplateDownload;
