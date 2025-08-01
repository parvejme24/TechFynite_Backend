import { Router } from 'express';
import { createCheckoutLink } from './checkout.controller';

const router = Router();

router.post('/checkout/:templateId', createCheckoutLink);

export default router; 