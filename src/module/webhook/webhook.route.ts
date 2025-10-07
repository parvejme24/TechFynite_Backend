import { Router } from 'express';
import { handleLemonSqueezyWebhook, testWebhook } from './webhook.controller';

const router = Router();

// Lemon Squeezy webhook endpoint
router.post('/webhook/lemonsqueezy', handleLemonSqueezyWebhook);

// Test webhook endpoint (for development)
router.get('/webhook/test', testWebhook);

export default router;
