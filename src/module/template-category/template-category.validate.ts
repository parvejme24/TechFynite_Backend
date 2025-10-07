import { Request, Response, NextFunction } from "express";
import { 
  createTemplateCategorySchema, 
  updateTemplateCategorySchema, 
  templateCategoryIdSchema, 
  templateCategoryQuerySchema 
} from "./template-category.type";

// Validate create template category
export const validateCreateTemplateCategory = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createTemplateCategorySchema.parse(req.body);
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

// Validate update template category
export const validateUpdateTemplateCategory = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateTemplateCategorySchema.parse(req.body);
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

// Validate template category ID
export const validateTemplateCategoryId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = templateCategoryIdSchema.parse(req.params);
    (req as any).validatedParams = validatedParams;
    return next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Invalid template category ID",
      error: error.errors || error.message,
    });
  }
};

// Validate template category query parameters
export const validateTemplateCategoryQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedQuery = templateCategoryQuerySchema.parse(req.query);
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
