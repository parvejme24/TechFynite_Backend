"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersByUserId = exports.deleteOrder = exports.getAllOrders = exports.getOrderById = exports.updateOrder = exports.createOrder = void 0;
const order_service_1 = require("./order.service");
const createOrder = async (req, res) => {
    try {
        const order = await order_service_1.OrderService.create(req.body);
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
};
exports.createOrder = createOrder;
const updateOrder = async (req, res) => {
    try {
        const order = await order_service_1.OrderService.update(req.params.id, req.body);
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
};
exports.updateOrder = updateOrder;
const getOrderById = async (req, res) => {
    try {
        const order = await order_service_1.OrderService.getById(req.params.id);
        if (!order)
            return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};
exports.getOrderById = getOrderById;
const getAllOrders = async (req, res) => {
    try {
        const orders = await order_service_1.OrderService.getAll();
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
exports.getAllOrders = getAllOrders;
const deleteOrder = async (req, res) => {
    try {
        await order_service_1.OrderService.delete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};
exports.deleteOrder = deleteOrder;
const getOrdersByUserId = async (req, res) => {
    try {
        const orders = await order_service_1.OrderService.getAllByUserId(req.params.userId);
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders by user' });
    }
};
exports.getOrdersByUserId = getOrdersByUserId;
