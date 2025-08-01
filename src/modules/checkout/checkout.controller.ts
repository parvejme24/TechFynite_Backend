import { Request, Response } from 'express';
import { CheckoutService } from './checkout.service';

export const createCheckoutLink = async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const checkoutData = await CheckoutService.createCheckoutLink(templateId, email, name);
    res.json(checkoutData);
  } catch (error) {
    console.error('Create checkout link error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout link', 
      details: error instanceof Error ? error.message : error 
    });
  }
}; 