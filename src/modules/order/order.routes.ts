import { Router } from 'express';
import {
  createOrder,
  updateOrder,
  getOrderById,
  getAllOrders,
  deleteOrder,
} from './order.controller';

const router = Router();

router.post('/orders', createOrder);
router.put('/orders/:id', updateOrder);
router.get('/orders/:id', getOrderById);
router.get('/orders', getAllOrders);
router.delete('/orders/:id', deleteOrder);

export default router; 