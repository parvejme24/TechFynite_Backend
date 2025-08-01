"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscribersWithAxios = exports.getNewsletterSubscriberCount = exports.getAllNewsletterSubscribers = exports.subscribeNewsletter = void 0;
const newsletter_service_1 = require("./newsletter.service");
const subscribeNewsletter = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }
    try {
        await newsletter_service_1.NewsletterService.subscribe(email);
        return res.status(200).json({ success: true, message: 'Subscribed successfully' });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
exports.subscribeNewsletter = subscribeNewsletter;
const getAllNewsletterSubscribers = async (req, res) => {
    try {
        const subscribers = await newsletter_service_1.NewsletterService.getAllSubscribers();
        return res.status(200).json(subscribers);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch newsletter subscribers'
        });
    }
};
exports.getAllNewsletterSubscribers = getAllNewsletterSubscribers;
const getNewsletterSubscriberCount = async (req, res) => {
    try {
        const count = await newsletter_service_1.NewsletterService.getSubscriberCount();
        return res.status(200).json(count);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch subscriber count'
        });
    }
};
exports.getNewsletterSubscriberCount = getNewsletterSubscriberCount;
// New controller method for Axios-based subscriber fetching
const getSubscribersWithAxios = async (req, res) => {
    try {
        const subscribers = await newsletter_service_1.NewsletterService.fetchSubscribersWithAxios();
        return res.status(200).json({
            success: true,
            data: subscribers,
            count: subscribers.length
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch subscribers with Axios'
        });
    }
};
exports.getSubscribersWithAxios = getSubscribersWithAxios;
