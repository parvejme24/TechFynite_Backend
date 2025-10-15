import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  createContactSchema,
  updateContactSchema,
  contactQuerySchema,
  createContactReplySchema,
  contactParamsSchema,
  userEmailParamsSchema,
} from "./contact.type";

// Validation middleware factory
const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req) as any;
      
      // Store validated data in request object
      if (validatedData.body) {
        (req as any).validatedBody = validatedData.body;
      }
      if (validatedData.query) {
        (req as any).validatedQuery = validatedData.query;
      }
      if (validatedData.params) {
        (req as any).validatedParams = validatedData.params;
      }
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = (error as any).errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errorMessages,
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: "Validation error",
        error: "Internal server error",
      });
    }
  };
};

// Contact validation middlewares
export const validateCreateContact = validate(createContactSchema);
export const validateUpdateContact = validate(updateContactSchema);
export const validateContactQuery = validate(contactQuerySchema);
export const validateCreateContactReply = validate(createContactReplySchema);
export const validateContactParams = validate(contactParamsSchema);
export const validateUserEmailParams = validate(userEmailParamsSchema);
