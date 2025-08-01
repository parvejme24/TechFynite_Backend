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

export const getAllNewsletterSubscribers = async (req: Request, res: Response) => {
  try {
    const subscribers = await NewsletterService.getAllSubscribers();
    return res.status(200).json(subscribers);
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch newsletter subscribers' 
    });
  }
};

export const getNewsletterSubscriberCount = async (req: Request, res: Response) => {
  try {
    const count = await NewsletterService.getSubscriberCount();
    return res.status(200).json(count);
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch subscriber count' 
    });
  }
};

// New controller method for Axios-based subscriber fetching
export const getSubscribersWithAxios = async (req: Request, res: Response) => {
  try {
    const subscribers = await NewsletterService.fetchSubscribersWithAxios();
    return res.status(200).json({
      success: true,
      data: subscribers,
      count: subscribers.length
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch subscribers with Axios' 
    });
  }
}; 