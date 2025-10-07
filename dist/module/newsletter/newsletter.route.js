"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsletter_controller_1 = require("./newsletter.controller");
const newsletter_validate_1 = require("./newsletter.validate");
const router = (0, express_1.Router)();
router.post("/newsletter", newsletter_validate_1.validateNewsletterSubscription, newsletter_controller_1.subscribeNewsletter);
router.get("/newsletter/subscribers", newsletter_controller_1.getAllNewsletterSubscribers);
router.get("/newsletter/stats", newsletter_validate_1.validateNewsletterStats, newsletter_controller_1.newsletterStats);
router.delete("/newsletter/:id", newsletter_validate_1.validateNewsletterId, newsletter_controller_1.deleteNewsletterSubscriber);
exports.default = router;
//# sourceMappingURL=newsletter.route.js.map