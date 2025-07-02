import { Router } from 'express';
import { checkout, fastspringWebhook } from './payment.controller';

const router = Router();

router.post('/checkout', checkout);
router.post('/webhook', fastspringWebhook);

export default router; 