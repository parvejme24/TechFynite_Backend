import { Request, Response, NextFunction } from "express";
import {
  createTemplateSchema,
  updateTemplateSchema,
  templateIdSchema,
  templateQuerySchema
} from "./template.type";

export const validateCreateTemplate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createTemplateSchema.parse(req.body);
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

export const validateUpdateTemplate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateTemplateSchema.parse(req.body);
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

export const validateTemplateId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = templateIdSchema.parse(req.params);
    (req as any).validatedParams = validatedParams;
    return next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Invalid template ID",
      errors: error.errors || error.message,
    });
  }
};

export const validateTemplateQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedQuery = templateQuerySchema.parse(req.query);
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
