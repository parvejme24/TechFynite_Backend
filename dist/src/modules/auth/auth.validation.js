"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserId = exports.validateUpdateUserStatus = exports.validateUpdateUserRole = exports.validateCreateAdminUser = exports.validateGetUsers = exports.validateChangePassword = exports.validateUpdateProfile = exports.validateResetPassword = exports.validateEmail = exports.validateOtp = exports.validateRefreshToken = exports.validateLogin = exports.validateRegister = exports.createValidationMiddleware = exports.userIdSchema = exports.updateUserStatusSchema = exports.updateUserRoleSchema = exports.createAdminUserSchema = exports.getUsersSchema = exports.changePasswordSchema = exports.updateProfileSchema = exports.resetPasswordSchema = exports.emailSchema = exports.otpSchema = exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
// Validation schemas
exports.registerSchema = {
    displayName: { type: 'string', required: true, minLength: 2, maxLength: 50 },
    email: { type: 'string', required: true, email: true },
    password: { type: 'string', required: true, minLength: 6 },
    phone: { type: 'string', required: false },
    country: { type: 'string', required: false },
    city: { type: 'string', required: false },
    stateOrRegion: { type: 'string', required: false },
    postCode: { type: 'string', required: false }
};
exports.loginSchema = {
    email: { type: 'string', required: true, email: true },
    password: { type: 'string', required: true }
};
exports.refreshTokenSchema = {
    refreshToken: { type: 'string', required: true }
};
exports.otpSchema = {
    email: { type: 'string', required: true, email: true },
    otpCode: { type: 'string', required: true, length: 6 }
};
exports.emailSchema = {
    email: { type: 'string', required: true, email: true }
};
exports.resetPasswordSchema = {
    email: { type: 'string', required: true, email: true },
    otpCode: { type: 'string', required: true, length: 6 },
    newPassword: { type: 'string', required: true, minLength: 6 }
};
exports.updateProfileSchema = {
    displayName: { type: 'string', required: false, minLength: 2, maxLength: 50 },
    phone: { type: 'string', required: false },
    country: { type: 'string', required: false },
    city: { type: 'string', required: false },
    stateOrRegion: { type: 'string', required: false },
    postCode: { type: 'string', required: false }
};
exports.changePasswordSchema = {
    currentPassword: { type: 'string', required: true },
    newPassword: { type: 'string', required: true, minLength: 6 }
};
exports.getUsersSchema = {
    page: { type: 'number', required: false, min: 1 },
    limit: { type: 'number', required: false, min: 1, max: 100 },
    search: { type: 'string', required: false },
    role: { type: 'string', required: false, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] }
};
exports.createAdminUserSchema = {
    displayName: { type: 'string', required: true, minLength: 2, maxLength: 50 },
    email: { type: 'string', required: true, email: true },
    password: { type: 'string', required: true, minLength: 6 },
    role: { type: 'string', required: true, enum: ['ADMIN', 'SUPER_ADMIN'] }
};
exports.updateUserRoleSchema = {
    role: { type: 'string', required: true, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] }
};
exports.updateUserStatusSchema = {
    isVerified: { type: 'boolean', required: true }
};
exports.userIdSchema = {
    userId: { type: 'string', required: true, uuid: true }
};
// Validation helper functions
const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const validateUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};
const validateField = (value, schema, fieldName) => {
    // Required check
    if (schema.required && (value === undefined || value === null || value === '')) {
        return `${fieldName} is required`;
    }
    // Type check
    if (value !== undefined && value !== null) {
        if (schema.type === 'string' && typeof value !== 'string') {
            return `${fieldName} must be a string`;
        }
        if (schema.type === 'number' && typeof value !== 'number') {
            return `${fieldName} must be a number`;
        }
        if (schema.type === 'boolean' && typeof value !== 'boolean') {
            return `${fieldName} must be a boolean`;
        }
        // String validations
        if (schema.type === 'string' && typeof value === 'string') {
            if (schema.minLength && value.length < schema.minLength) {
                return `${fieldName} must be at least ${schema.minLength} characters`;
            }
            if (schema.maxLength && value.length > schema.maxLength) {
                return `${fieldName} must be at most ${schema.maxLength} characters`;
            }
            if (schema.length && value.length !== schema.length) {
                return `${fieldName} must be exactly ${schema.length} characters`;
            }
            if (schema.email && !validateEmailFormat(value)) {
                return `${fieldName} must be a valid email address`;
            }
            if (schema.uuid && !validateUUID(value)) {
                return `${fieldName} must be a valid UUID`;
            }
            if (schema.enum && !schema.enum.includes(value)) {
                return `${fieldName} must be one of: ${schema.enum.join(', ')}`;
            }
        }
        // Number validations
        if (schema.type === 'number' && typeof value === 'number') {
            if (schema.min !== undefined && value < schema.min) {
                return `${fieldName} must be at least ${schema.min}`;
            }
            if (schema.max !== undefined && value > schema.max) {
                return `${fieldName} must be at most ${schema.max}`;
            }
        }
    }
    return null;
};
// Validation middleware factory
const createValidationMiddleware = (schema) => {
    return (req, res, next) => {
        const errors = [];
        const data = { ...req.body, ...req.params, ...req.query };
        for (const [fieldName, fieldSchema] of Object.entries(schema)) {
            const error = validateField(data[fieldName], fieldSchema, fieldName);
            if (error) {
                errors.push(error);
            }
        }
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors
            });
        }
        next();
    };
};
exports.createValidationMiddleware = createValidationMiddleware;
// Export validation middlewares
exports.validateRegister = (0, exports.createValidationMiddleware)(exports.registerSchema);
exports.validateLogin = (0, exports.createValidationMiddleware)(exports.loginSchema);
exports.validateRefreshToken = (0, exports.createValidationMiddleware)(exports.refreshTokenSchema);
exports.validateOtp = (0, exports.createValidationMiddleware)(exports.otpSchema);
exports.validateEmail = (0, exports.createValidationMiddleware)(exports.emailSchema);
exports.validateResetPassword = (0, exports.createValidationMiddleware)(exports.resetPasswordSchema);
exports.validateUpdateProfile = (0, exports.createValidationMiddleware)(exports.updateProfileSchema);
exports.validateChangePassword = (0, exports.createValidationMiddleware)(exports.changePasswordSchema);
exports.validateGetUsers = (0, exports.createValidationMiddleware)(exports.getUsersSchema);
exports.validateCreateAdminUser = (0, exports.createValidationMiddleware)(exports.createAdminUserSchema);
exports.validateUpdateUserRole = (0, exports.createValidationMiddleware)(exports.updateUserRoleSchema);
exports.validateUpdateUserStatus = (0, exports.createValidationMiddleware)(exports.updateUserStatusSchema);
exports.validateUserId = (0, exports.createValidationMiddleware)(exports.userIdSchema);
