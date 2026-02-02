import { Request, Response, NextFunction } from "express";
import { 
  createBlogSchema, 
  updateBlogSchema, 
  blogQuerySchema, 
  blogIdSchema, 
  categoryIdSchema, 
  authorIdSchema,
  blogLikeSchema,
  blogStatusSchema,
  blogReactionSchema
} from "./blog.type";

// Validate blog creation
export const validateCreateBlog = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createBlogSchema.parse(req.body);
    req.body = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.errors || error.message,
    });
  }
};

// Validate blog update
export const validateUpdateBlog = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Allow empty body for update (all fields are optional)
    if (!req.body || Object.keys(req.body).length === 0) {
      req.body = {};
      next();
      return;
    }
    
    const validatedData = updateBlogSchema.parse(req.body);
    req.body = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.errors || error.message,
    });
  }
};

// Validate blog query parameters
export const validateBlogQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = blogQuerySchema.parse(req.query);
    (req as any).validatedQuery = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      error: error.errors || error.message,
    });
  }
};

// Validate blog ID parameter
export const validateBlogId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = blogIdSchema.parse(req.params);
    req.params = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Invalid blog ID",
      error: error.errors || error.message,
    });
  }
};

// Validate category ID parameter
export const validateCategoryId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = categoryIdSchema.parse(req.params);
    req.params = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
      error: error.errors || error.message,
    });
  }
};

// Validate author ID parameter
export const validateAuthorId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = authorIdSchema.parse(req.params);
    req.params = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Invalid author ID",
      error: error.errors || error.message,
    });
  }
};

// Validate blog like
export const validateBlogLike = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = blogLikeSchema.parse(req.body);
    req.body = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.errors || error.message,
    });
  }
};

// Validate blog status update
export const validateBlogStatus = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = blogStatusSchema.parse(req.body);
    req.body = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.errors || error.message,
    });
  }
};

// Validate blog reaction
export const validateBlogReaction = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = blogReactionSchema.parse(req.body);
    req.body = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.errors || error.message,
    });
  }
};
