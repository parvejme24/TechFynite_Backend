"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLicenses = exports.getLicenseStats = exports.revokeLicense = exports.validateLicense = exports.getLicenseById = exports.getAllLicenses = void 0;
const license_service_1 = require("./license.service");
const licenseService = new license_service_1.LicenseService();
const getAllLicenses = async (req, res) => {
    try {
        const query = req.validatedQuery || req.query;
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
    }
    catch (error) {
        console.error("Error fetching licenses:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch licenses",
            error: error.message,
        });
    }
};
exports.getAllLicenses = getAllLicenses;
const getLicenseById = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error fetching license:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch license",
            error: error.message,
        });
    }
};
exports.getLicenseById = getLicenseById;
const validateLicense = async (req, res) => {
    try {
        const data = req.validatedData;
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
    }
    catch (error) {
        console.error("Error validating license:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to validate license",
            error: error.message,
        });
    }
};
exports.validateLicense = validateLicense;
const revokeLicense = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.validatedData;
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
    }
    catch (error) {
        console.error("Error revoking license:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to revoke license",
            error: error.message,
        });
    }
};
exports.revokeLicense = revokeLicense;
const getLicenseStats = async (req, res) => {
    try {
        const stats = await licenseService.getLicenseStats();
        return res.status(200).json({
            success: true,
            message: "License statistics fetched successfully",
            data: stats,
        });
    }
    catch (error) {
        console.error("Error fetching license statistics:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch license statistics",
            error: error.message,
        });
    }
};
exports.getLicenseStats = getLicenseStats;
const getUserLicenses = async (req, res) => {
    try {
        const userId = req.user?.id;
        const query = req.validatedQuery || req.query;
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
    }
    catch (error) {
        console.error("Error fetching user licenses:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user licenses",
            error: error.message,
        });
    }
};
exports.getUserLicenses = getUserLicenses;
//# sourceMappingURL=license.controller.js.map