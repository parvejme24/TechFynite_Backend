import { Request, Response } from 'express';

export const fastspringWebhook = (req: Request, res: Response) => {
  // TODO: Validate webhook secret if needed
  // TODO: Process webhook event (update order/payment status, etc.)
  console.log('FastSpring Webhook received:', req.body);
  res.status(200).send('OK');
}; 