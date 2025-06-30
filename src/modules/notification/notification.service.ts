import { NotificationModel } from './notification.model';
import { CreateNotificationRequest, UpdateNotificationRequest } from './notification.types';

export const NotificationService = {
  create: (data: CreateNotificationRequest) => NotificationModel.create(data),
  update: (id: string, data: UpdateNotificationRequest) => NotificationModel.update(id, data),
  getAll: () => NotificationModel.findAll(),
  getById: (id: string) => NotificationModel.findById(id),
  delete: (id: string) => NotificationModel.delete(id),
}; 