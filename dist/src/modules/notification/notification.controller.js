"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.getAllNotifications = exports.getNotificationById = exports.updateNotification = exports.createNotification = void 0;
const notification_service_1 = require("./notification.service");
const createNotification = async (req, res) => {
    try {
        const notification = await notification_service_1.NotificationService.create(req.body);
        res.status(201).json(notification);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create notification' });
    }
};
exports.createNotification = createNotification;
const updateNotification = async (req, res) => {
    try {
        const notification = await notification_service_1.NotificationService.update(req.params.id, req.body);
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update notification' });
    }
};
exports.updateNotification = updateNotification;
const getNotificationById = async (req, res) => {
    try {
        const notification = await notification_service_1.NotificationService.getById(req.params.id);
        if (!notification)
            return res.status(404).json({ error: 'Notification not found' });
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notification' });
    }
};
exports.getNotificationById = getNotificationById;
const getAllNotifications = async (req, res) => {
    try {
        const notifications = await notification_service_1.NotificationService.getAll();
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};
exports.getAllNotifications = getAllNotifications;
const deleteNotification = async (req, res) => {
    try {
        await notification_service_1.NotificationService.delete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
};
exports.deleteNotification = deleteNotification;
