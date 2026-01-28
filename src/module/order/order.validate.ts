import { Request, Response, NextFunction } from "express";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdSchema,
  orderQuerySchema
} from "./order.type";

export const validateCreateOrder = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    (req as any).validatedData = validatedData;
    return next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.errors || error.message,
    });
  }
};

export const validateUpdateOrderStatus = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateOrderStatusSchema.parse(req.body);
    (req as any).validatedData = validatedData;
    return next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.errors || error.message,
    });
  }
};

export const validateOrderId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = orderIdSchema.parse(req.params);
    (req as any).validatedParams = validatedParams;
    return next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
      errors: error.errors || error.message,
    });
  }
};

export const validateOrderQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedQuery = orderQuerySchema.parse(req.query);
    (req as any).validatedQuery = validatedQuery;
    return next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      errors: error.errors || error.message,
    });
  }
};


