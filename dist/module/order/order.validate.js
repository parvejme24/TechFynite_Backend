"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOrderQuery = exports.validateOrderId = exports.validateUpdateOrderStatus = exports.validateCreateOrder = void 0;
const order_type_1 = require("./order.type");
const validateCreateOrder = (req, res, next) => {
    try {
        const validatedData = order_type_1.createOrderSchema.parse(req.body);
        req.validatedData = validatedData;
        return next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.errors || error.message,
        });
    }
};
exports.validateCreateOrder = validateCreateOrder;
const validateUpdateOrderStatus = (req, res, next) => {
    try {
        const validatedData = order_type_1.updateOrderStatusSchema.parse(req.body);
        req.validatedData = validatedData;
        return next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.errors || error.message,
        });
    }
};
exports.validateUpdateOrderStatus = validateUpdateOrderStatus;
const validateOrderId = (req, res, next) => {
    try {
        const validatedParams = order_type_1.orderIdSchema.parse(req.params);
        req.validatedParams = validatedParams;
        return next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid order ID",
            errors: error.errors || error.message,
        });
    }
};
exports.validateOrderId = validateOrderId;
const validateOrderQuery = (req, res, next) => {
    try {
        const validatedQuery = order_type_1.orderQuerySchema.parse(req.query);
        req.validatedQuery = validatedQuery;
        return next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid query parameters",
            errors: error.errors || error.message,
        });
    }
};
exports.validateOrderQuery = validateOrderQuery;
//# sourceMappingURL=order.validate.js.map