import { Router } from 'express';
import {
  createNotification,
  updateNotification,
  getNotificationById,
  getAllNotifications,
  deleteNotification,
} from './notification.controller';

const router = Router();

router.post('/notifications', createNotification);
router.put('/notifications/:id', updateNotification);
router.get('/notifications/:id', getNotificationById);
router.get('/notifications', getAllNotifications);
router.delete('/notifications/:id', deleteNotification);

export default router; 