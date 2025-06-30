import { Request, Response } from 'express';
import { NotificationService } from './notification.service';

export const createNotification = async (req: Request, res: Response) => {
  try {
    const notification = await NotificationService.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  try {
    const notification = await NotificationService.update(req.params.id, req.body);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const notification = await NotificationService.getById(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notification' });
  }
};

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await NotificationService.getAll();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    await NotificationService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
}; 