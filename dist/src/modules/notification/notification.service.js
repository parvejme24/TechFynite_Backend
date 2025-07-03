"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_model_1 = require("./notification.model");
exports.NotificationService = {
    create: (data) => notification_model_1.NotificationModel.create(data),
    update: (id, data) => notification_model_1.NotificationModel.update(id, data),
    getAll: () => notification_model_1.NotificationModel.findAll(),
    getById: (id) => notification_model_1.NotificationModel.findById(id),
    delete: (id) => notification_model_1.NotificationModel.delete(id),
};
