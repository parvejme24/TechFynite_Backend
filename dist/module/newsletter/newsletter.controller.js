"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterStats = exports.deleteNewsletterSubscriber = exports.getAllNewsletterSubscribers = exports.subscribeNewsletter = void 0;
const newsletter_service_1 = require("./newsletter.service");
const newsletterService = new newsletter_service_1.NewsletterService();
const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;
        const subscriber = await newsletterService.subscribeNewsletter(email);
        return res.status(201).json({
            success: true,
            message: "Successfully subscribed to newsletter",
            data: subscriber,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to subscribe to newsletter",
        });
    }
};
exports.subscribeNewsletter = subscribeNewsletter;
const getAllNewsletterSubscribers = async (req, res) => {
    try {
        const subscribers = await newsletterService.getAllSubscribers();
        return res.status(200).json({
            success: true,
            message: "Newsletter subscribers fetched successfully",
            data: subscribers,
            count: subscribers.length,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch newsletter subscribers",
        });
    }
};
exports.getAllNewsletterSubscribers = getAllNewsletterSubscribers;
const deleteNewsletterSubscriber = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await newsletterService.deleteSubscriber(id);
        if (!result.success) {
            return res.status(404).json({
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
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete newsletter subscriber",
        });
    }
};
exports.deleteNewsletterSubscriber = deleteNewsletterSubscriber;
const newsletterStats = async (req, res) => {
    try {
        const { period, startDate, endDate } = req.query;
        const stats = await newsletterService.getNewsletterStats(period, startDate, endDate);
        return res.status(200).json({
            success: true,
            message: "Newsletter statistics fetched successfully",
            data: stats,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch newsletter statistics",
        });
    }
};
exports.newsletterStats = newsletterStats;
//# sourceMappingURL=newsletter.controller.js.map