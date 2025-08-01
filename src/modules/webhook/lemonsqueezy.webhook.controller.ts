import { Request, Response } from 'express';
import { LemonSqueezyWebhookService } from './lemonsqueezy.webhook.service';

export const handleLemonSqueezyWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-signature'] as string;
    const body = req.body;

    if (!signature) {
      return res.status(401).json({ error: 'Missing signature' });
    }

    // Verify webhook signature
    const isValid = LemonSqueezyWebhookService.verifySignature(body, signature);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Process the webhook
    const result = await LemonSqueezyWebhookService.processWebhook(body);
    
    res.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      orderId: result.orderId 
    });
  } catch (error) {
    console.error('LemonSqueezy webhook error:', error);
    res.status(500).json({ 
      error: 'Failed to process webhook', 
      details: error instanceof Error ? error.message : error 
    });
  }
}; 