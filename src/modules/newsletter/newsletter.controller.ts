import { Request, Response } from 'express';
import { NewsletterService } from './newsletter.service';

export const subscribeNewsletter = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  try {
    await NewsletterService.subscribe(email);
    return res.status(200).json({ success: true, message: 'Subscribed successfully' });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}; 