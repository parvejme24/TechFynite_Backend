"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTemplateCategoryQuery = exports.validateTemplateCategoryId = exports.validateUpdateTemplateCategory = exports.validateCreateTemplateCategory = void 0;
const template_category_type_1 = require("./template-category.type");
const validateCreateTemplateCategory = (req, res, next) => {
    try {
        const validatedData = template_category_type_1.createTemplateCategorySchema.parse(req.body);
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
exports.validateCreateTemplateCategory = validateCreateTemplateCategory;
const validateUpdateTemplateCategory = (req, res, next) => {
    try {
        const validatedData = template_category_type_1.updateTemplateCategorySchema.parse(req.body);
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
exports.validateUpdateTemplateCategory = validateUpdateTemplateCategory;
const validateTemplateCategoryId = (req, res, next) => {
    try {
        const validatedParams = template_category_type_1.templateCategoryIdSchema.parse(req.params);
        req.validatedParams = validatedParams;
        return next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid template category ID",
            error: error.errors || error.message,
        });
    }
};
exports.validateTemplateCategoryId = validateTemplateCategoryId;
const validateTemplateCategoryQuery = (req, res, next) => {
    try {
        const validatedQuery = template_category_type_1.templateCategoryQuerySchema.parse(req.query);
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
exports.validateTemplateCategoryQuery = validateTemplateCategoryQuery;
//# sourceMappingURL=template-category.validate.js.map