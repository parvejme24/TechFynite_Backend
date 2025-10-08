"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLicenseQuery = exports.validateLicenseId = exports.validateRevokeLicense = exports.validateLicenseKey = void 0;
const license_type_1 = require("./license.type");
const validateLicenseKey = (req, res, next) => {
    try {
        const validatedData = license_type_1.validateLicenseSchema.parse(req.body);
        req.validatedData = validatedData;
        return next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.errors || error.message,
        });
    }
};
exports.validateLicenseKey = validateLicenseKey;
const validateRevokeLicense = (req, res, next) => {
    try {
        const validatedData = license_type_1.revokeLicenseSchema.parse(req.body);
        req.validatedData = validatedData;
        return next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.errors || error.message,
        });
    }
};
exports.validateRevokeLicense = validateRevokeLicense;
const validateLicenseId = (req, res, next) => {
    try {
        const validatedParams = license_type_1.licenseIdSchema.parse(req.params);
        req.validatedParams = validatedParams;
        return next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid license ID",
            errors: error.errors || error.message,
        });
    }
};
exports.validateLicenseId = validateLicenseId;
const validateLicenseQuery = (req, res, next) => {
    try {
        const validatedQuery = license_type_1.licenseQuerySchema.parse(req.query);
        req.validatedQuery = validatedQuery;
        return next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid query parameters",
            errors: error.errors || error.message,
        });
    }
};
exports.validateLicenseQuery = validateLicenseQuery;
//# sourceMappingURL=license.validate.js.map