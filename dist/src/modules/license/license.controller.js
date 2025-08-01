"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLicense = void 0;
const license_service_1 = require("./license.service");
const validateLicense = async (req, res) => {
    try {
        const { licenseKey, templateId } = req.body;
        if (!licenseKey || !templateId) {
            return res.status(400).json({
                error: 'License key and template ID are required'
            });
        }
        const validationResult = await license_service_1.LicenseService.validateLicense(licenseKey, templateId);
        res.json(validationResult);
    }
    catch (error) {
        console.error('License validation error:', error);
        res.status(500).json({
            error: 'Failed to validate license',
            details: error instanceof Error ? error.message : error
        });
    }
};
exports.validateLicense = validateLicense;
