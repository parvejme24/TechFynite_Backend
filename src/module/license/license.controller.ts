import { Request, Response } from "express";
import { LicenseService } from "./license.service";

const licenseService = new LicenseService();

// Get all licenses
export const getAllLicenses = async (req: Request, res: Response) => {
  try {
    const query = (req as any).validatedQuery || req.query;
    const { page = 1, limit = 10, userId, templateId, licenseType, isActive, sortBy, sortOrder } = query;

    const result = await licenseService.getAllLicenses({
      page,
      limit,
      userId,
      templateId,
      licenseType,
      isActive,
      sortBy,
      sortOrder,
    });

    return res.status(200).json({
      success: true,
      message: "Licenses fetched successfully",
      data: result.licenses,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Error fetching licenses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch licenses",
      error: error.message,
    });
  }
};

// Get license by ID
export const getLicenseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const license = await licenseService.getLicenseById(id);

    if (!license) {
      return res.status(404).json({
        success: false,
        message: "License not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "License fetched successfully",
      data: license,
    });
  } catch (error: any) {
    console.error("Error fetching license:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch license",
      error: error.message,
    });
  }
};

// Validate license
export const validateLicense = async (req: Request, res: Response) => {
  try {
    const data = (req as any).validatedData;

    const result = await licenseService.validateLicense(data);

    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        message: result.message,
        data: {
          isValid: result.isValid,
          isExpired: result.isExpired,
          isRevoked: result.isRevoked,
          remainingUsage: result.remainingUsage,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        isValid: result.isValid,
        license: result.license,
        remainingUsage: result.remainingUsage,
      },
    });
  } catch (error: any) {
    console.error("Error validating license:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to validate license",
      error: error.message,
    });
  }
};

// Revoke license
export const revokeLicense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = (req as any).validatedData;

    const result = await licenseService.revokeLicense(id, data);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error("Error revoking license:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to revoke license",
      error: error.message,
    });
  }
};

// Get license statistics
export const getLicenseStats = async (req: Request, res: Response) => {
  try {
    const stats = await licenseService.getLicenseStats();

    return res.status(200).json({
      success: true,
      message: "License statistics fetched successfully",
      data: stats,
    });
  } catch (error: any) {
    console.error("Error fetching license statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch license statistics",
      error: error.message,
    });
  }
};

// Get user licenses
export const getUserLicenses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const query = (req as any).validatedQuery || req.query;
    const { page = 1, limit = 10, templateId, licenseType, isActive, sortBy, sortOrder } = query;

    const result = await licenseService.getUserLicenses(userId, {
      page,
      limit,
      templateId,
      licenseType,
      isActive,
      sortBy,
      sortOrder,
    });

    return res.status(200).json({
      success: true,
      message: "User licenses fetched successfully",
      data: result.licenses,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Error fetching user licenses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user licenses",
      error: error.message,
    });
  }
};
