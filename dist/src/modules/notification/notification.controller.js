"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.getAllNotifications = exports.getNotificationById = exports.updateNotification = exports.createNotification = void 0;
const notification_service_1 = require("./notification.service");
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield notification_service_1.NotificationService.create(req.body);
        res.status(201).json(notification);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create notification' });
    }
});
exports.createNotification = createNotification;
const updateNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield notification_service_1.NotificationService.update(req.params.id, req.body);
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update notification' });
    }
});
exports.updateNotification = updateNotification;
const getNotificationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield notification_service_1.NotificationService.getById(req.params.id);
        if (!notification)
            return res.status(404).json({ error: 'Notification not found' });
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notification' });
    }
});
exports.getNotificationById = getNotificationById;
const getAllNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield notification_service_1.NotificationService.getAll();
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
exports.getAllNotifications = getAllNotifications;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield notification_service_1.NotificationService.delete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});
exports.deleteNotification = deleteNotification;
