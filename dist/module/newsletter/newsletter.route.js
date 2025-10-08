"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsletter_controller_1 = require("./newsletter.controller");
const router = (0, express_1.Router)();
router.post("/newsletter", newsletter_controller_1.subscribeNewsletter);
router.get("/newsletter", newsletter_controller_1.getAllNewsletterSubscribers);
router.get("/newsletter/stats", newsletter_controller_1.newsletterStats);
router.delete("/newsletter/:id", newsletter_controller_1.deleteNewsletterSubscriber);
exports.default = router;
//# sourceMappingURL=newsletter.route.js.map