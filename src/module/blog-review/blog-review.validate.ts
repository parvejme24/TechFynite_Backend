import { Request, Response, NextFunction } from "express";
import { 
  createBlogReviewSchema, 
  createBlogReviewReplySchema, 
  blogReviewQuerySchema, 
  blogReviewIdSchema,
  blogIdParamSchema,
  blogReviewReplyIdSchema,
  updateBlogReviewSchema,
} from "./blog-review.type";

// Validate blog review creation
export const validateCreateBlogReview = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createBlogReviewSchema.parse(req.body);
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

// Validate blog review reply creation
export const validateCreateBlogReviewReply = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createBlogReviewReplySchema.parse(req.body);
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

// Validate blog review query parameters
export const validateBlogReviewQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = blogReviewQuerySchema.parse(req.query);
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

// Validate blog review ID parameter
export const validateBlogReviewId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = blogReviewIdSchema.parse(req.params);
    req.params = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Invalid review ID",
      error: error.errors || error.message,
    });
  }
};

// Validate blog ID parameter
export const validateBlogIdParam = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = blogIdParamSchema.parse(req.params);
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

// Validate blog review reply ID parameter
export const validateBlogReviewReplyId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = blogReviewReplyIdSchema.parse(req.params);
    req.params = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Invalid reply ID",
      error: error.errors || error.message,
    });
  }
};

// Validate blog review update
export const validateUpdateBlogReview = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateBlogReviewSchema.parse(req.body);
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

// Validate review approval
// Approval validation removed to match Prisma model
