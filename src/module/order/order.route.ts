import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrderStats,
  getUserOrders,
} from './order.controller';
import { authenticateUser, authenticateAdminAndCheckStatus } from '../../middleware/authMiddleware';
import {
  validateCreateOrder,
  validateUpdateOrderStatus,
  validateOrderId,
  validateOrderQuery,
} from './order.validate';

const router = Router();

// Public routes
router.get('/orders', validateOrderQuery, getAllOrders);
router.get('/orders/stats', getOrderStats);
router.get('/orders/:id', validateOrderId, getOrderById);

// User routes
router.get('/user/orders', authenticateUser, validateOrderQuery, getUserOrders);

// Admin routes
router.post('/orders', authenticateAdminAndCheckStatus, validateCreateOrder, createOrder);
router.patch('/orders/:id/status', authenticateAdminAndCheckStatus, validateOrderId, validateUpdateOrderStatus, updateOrderStatus);

export default router;
