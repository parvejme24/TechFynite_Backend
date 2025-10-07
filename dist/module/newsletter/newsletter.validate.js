"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNewsletterId = exports.validateNewsletterStats = exports.validateNewsletterSubscription = void 0;
const newsletter_type_1 = require("./newsletter.type");
const validateNewsletterSubscription = (req, res, next) => {
    try {
        const validatedData = newsletter_type_1.newsletterSubscriptionSchema.parse(req.body);
        req.body = validatedData;
        next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.errors || error.message,
        });
    }
};
exports.validateNewsletterSubscription = validateNewsletterSubscription;
const validateNewsletterStats = (req, res, next) => {
    try {
        const validatedData = newsletter_type_1.newsletterStatsSchema.parse(req.query);
        req.query = validatedData;
        next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.errors || error.message,
        });
    }
};
exports.validateNewsletterStats = validateNewsletterStats;
const validateNewsletterId = (req, res, next) => {
    try {
        const validatedData = newsletter_type_1.newsletterIdSchema.parse(req.params);
        req.params = validatedData;
        next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid newsletter ID format",
            errors: error.errors || error.message,
        });
    }
};
exports.validateNewsletterId = validateNewsletterId;
//# sourceMappingURL=newsletter.validate.js.map