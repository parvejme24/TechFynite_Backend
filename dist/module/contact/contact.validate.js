"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserEmailParams = exports.validateContactParams = exports.validateCreateContactReply = exports.validateContactQuery = exports.validateUpdateContact = exports.validateCreateContact = void 0;
const zod_1 = require("zod");
const contact_type_1 = require("./contact.type");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req);
            if (validatedData.body) {
                req.validatedBody = validatedData.body;
            }
            if (validatedData.query) {
                req.validatedQuery = validatedData.query;
            }
            if (validatedData.params) {
                req.validatedParams = validatedData.params;
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const errorMessages = error.errors.map((err) => ({
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
exports.validateCreateContact = validate(contact_type_1.createContactSchema);
exports.validateUpdateContact = validate(contact_type_1.updateContactSchema);
exports.validateContactQuery = validate(contact_type_1.contactQuerySchema);
exports.validateCreateContactReply = validate(contact_type_1.createContactReplySchema);
exports.validateContactParams = validate(contact_type_1.contactParamsSchema);
exports.validateUserEmailParams = validate(contact_type_1.userEmailParamsSchema);
//# sourceMappingURL=contact.validate.js.map