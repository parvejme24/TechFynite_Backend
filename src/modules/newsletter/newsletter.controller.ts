import { Request, Response } from 'express';
import { NewsletterService } from './newsletter.service';

export const subscribeNewsletter = async (req: Request, res: Response) => {
  // Check if req.body exists
  if (!req.body) {
    return res.status(400).json({ 
      success: false, 
      message: 'Request body is missing. Please ensure Content-Type is application/json' 
    });
  }

  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email is required in request body' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide a valid email address' 
    });
  }

  try {
    // Try Mailchimp first
    await NewsletterService.subscribe(email);
    
    // Also save to database as backup
    try {
      await NewsletterService.subscribeToDatabase(email);
    } catch (dbError) {
      // Database backup failed, but this is non-critical
      console.log('Database backup failed (non-critical):', dbError);
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Subscribed successfully' 
    });
  } catch (mailchimpError: any) {
    console.error('Mailchimp subscription failed:', mailchimpError);
    
    // Fallback to database-only subscription
    try {
      const result = await NewsletterService.subscribeToDatabase(email);
      return res.status(200).json({ 
        success: true, 
        message: result.message || 'Subscribed successfully (database only)' 
      });
    } catch (dbError: any) {
      console.error('Database subscription also failed:', dbError);
      return res.status(400).json({ 
        success: false, 
        message: dbError.message || 'Failed to subscribe to newsletter' 
      });
    }
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

// Database-based newsletter controllers
export const getAllNewsletterSubscribersFromDatabase = async (req: Request, res: Response) => {
  try {
    const subscribers = await NewsletterService.getAllSubscribersFromDatabase();
    return res.status(200).json({
      success: true,
      data: subscribers,
      count: subscribers.length
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch newsletter subscribers from database' 
    });
  }
};

export const getNewsletterSubscriberCountFromDatabase = async (req: Request, res: Response) => {
  try {
    const count = await NewsletterService.getSubscriberCountFromDatabase();
    return res.status(200).json({
      success: true,
      data: count
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch subscriber count from database' 
    });
  }
};

export const unsubscribeNewsletter = async (req: Request, res: Response) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email is required in request body' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide a valid email address' 
    });
  }

  try {
    const result = await NewsletterService.unsubscribeFromDatabase(email);
    return res.status(200).json({ 
      success: true, 
      message: result.message || 'Unsubscribed successfully' 
    });
  } catch (error: any) {
    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to unsubscribe from newsletter' 
    });
  }
}; 