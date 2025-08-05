import { Request, Response, NextFunction } from 'express';

// Validation schemas
export const registerSchema = {
  displayName: { type: 'string', required: true, minLength: 2, maxLength: 50 },
  email: { type: 'string', required: true, email: true },
  password: { type: 'string', required: true, minLength: 6 },
  phone: { type: 'string', required: false },
  country: { type: 'string', required: false },
  city: { type: 'string', required: false },
  stateOrRegion: { type: 'string', required: false },
  postCode: { type: 'string', required: false }
};

export const loginSchema = {
  email: { type: 'string', required: true, email: true },
  password: { type: 'string', required: true }
};

export const refreshTokenSchema = {
  refreshToken: { type: 'string', required: true }
};

export const otpSchema = {
  email: { type: 'string', required: true, email: true },
  otpCode: { type: 'string', required: true, length: 6 }
};

export const emailSchema = {
  email: { type: 'string', required: true, email: true }
};

export const resetPasswordSchema = {
  email: { type: 'string', required: true, email: true },
  otpCode: { type: 'string', required: true, length: 6 },
  newPassword: { type: 'string', required: true, minLength: 6 }
};

export const updateProfileSchema = {
  displayName: { type: 'string', required: false, minLength: 2, maxLength: 50 },
  phone: { type: 'string', required: false },
  country: { type: 'string', required: false },
  city: { type: 'string', required: false },
  stateOrRegion: { type: 'string', required: false },
  postCode: { type: 'string', required: false }
};

export const changePasswordSchema = {
  currentPassword: { type: 'string', required: true },
  newPassword: { type: 'string', required: true, minLength: 6 }
};

export const getUsersSchema = {
  page: { type: 'number', required: false, min: 1 },
  limit: { type: 'number', required: false, min: 1, max: 100 },
  search: { type: 'string', required: false },
  role: { type: 'string', required: false, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] }
};

export const createAdminUserSchema = {
  displayName: { type: 'string', required: true, minLength: 2, maxLength: 50 },
  email: { type: 'string', required: true, email: true },
  password: { type: 'string', required: true, minLength: 6 },
  role: { type: 'string', required: true, enum: ['ADMIN', 'SUPER_ADMIN'] }
};

export const updateUserRoleSchema = {
  role: { type: 'string', required: true, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] }
};

export const updateUserStatusSchema = {
  isVerified: { type: 'boolean', required: true }
};

export const userIdSchema = {
  userId: { type: 'string', required: true, uuid: true }
};

// Validation helper functions
const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

const validateField = (value: any, schema: any, fieldName: string): string | null => {
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
export const createValidationMiddleware = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];
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

// Export validation middlewares
export const validateRegister = createValidationMiddleware(registerSchema);
export const validateLogin = createValidationMiddleware(loginSchema);
export const validateRefreshToken = createValidationMiddleware(refreshTokenSchema);
export const validateOtp = createValidationMiddleware(otpSchema);
export const validateEmail = createValidationMiddleware(emailSchema);
export const validateResetPassword = createValidationMiddleware(resetPasswordSchema);
export const validateUpdateProfile = createValidationMiddleware(updateProfileSchema);
export const validateChangePassword = createValidationMiddleware(changePasswordSchema);
export const validateGetUsers = createValidationMiddleware(getUsersSchema);
export const validateCreateAdminUser = createValidationMiddleware(createAdminUserSchema);
export const validateUpdateUserRole = createValidationMiddleware(updateUserRoleSchema);
export const validateUpdateUserStatus = createValidationMiddleware(updateUserStatusSchema);
export const validateUserId = createValidationMiddleware(userIdSchema); 