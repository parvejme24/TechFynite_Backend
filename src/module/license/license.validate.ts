import { Request, Response, NextFunction } from "express";
import {
  validateLicenseSchema,
  revokeLicenseSchema,
  licenseIdSchema,
  licenseQuerySchema
} from "./license.type";

export const validateLicenseKey = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = validateLicenseSchema.parse(req.body);
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

export const validateRevokeLicense = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = revokeLicenseSchema.parse(req.body);
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

export const validateLicenseId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedParams = licenseIdSchema.parse(req.params);
    (req as any).validatedParams = validatedParams;
    return next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Invalid license ID",
      errors: error.errors || error.message,
    });
  }
};

export const validateLicenseQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedQuery = licenseQuerySchema.parse(req.query);
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
