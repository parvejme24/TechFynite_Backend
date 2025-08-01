import { Router } from 'express';
import { 
  checkout, 
  fastspringWebhook, 
  getPaymentStatus, 
  getUserPaymentHistory 
} from './payment.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

// Legacy FastSpring routes (deprecated)
router.post('/checkout', checkout);
router.post('/webhook', fastspringWebhook);

// New payment routes
router.get('/payment/status/:orderId', getPaymentStatus);
router.get('/payment/history', authMiddleware, getUserPaymentHistory);

export default router; 