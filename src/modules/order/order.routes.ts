import { Router } from 'express';
import {
  getUserOrders,
  getOrderById,
  getTemplateDownload,
} from './order.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

// User order routes (require authentication)
router.get('/user/orders', authMiddleware, getUserOrders);
router.get('/user/orders/:id', authMiddleware, getOrderById);
router.get('/user/download/:templateId', authMiddleware, getTemplateDownload);

export default router;
