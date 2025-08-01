import { Router } from 'express';
import { handleLemonSqueezyWebhook } from './lemonsqueezy.webhook.controller';

const router = Router();

router.post('/webhook/lemonsqueezy', handleLemonSqueezyWebhook);

export default router; 