import { Request, Response } from 'express';
import { SubscriptionService } from './subscription.service';

// Subscription Management
export const createSubscription = async (req: Request, res: Response) => {
  try {
    const result = await SubscriptionService.createSubscription(req.body);
    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await SubscriptionService.getSubscriptionById(id);
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
};

export const getUserSubscriptions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const result = await SubscriptionService.getUserSubscriptions(userId);
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getUserActiveSubscription = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const result = await SubscriptionService.getUserActiveSubscription(userId);
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await SubscriptionService.updateSubscription(id, req.body);
    res.json({
      success: true,
      message: 'Subscription updated successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await SubscriptionService.cancelSubscription(id);
    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await SubscriptionService.deleteSubscription(id);
    res.json({
      success: true,
      message: 'Subscription deleted successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Subscription Plan Management
export const createSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const result = await SubscriptionService.createSubscriptionPlan(req.body);
    res.status(201).json({
      success: true,
      message: 'Subscription plan created successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getSubscriptionPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await SubscriptionService.getSubscriptionPlanById(id);
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
};

export const getSubscriptionPlanBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await SubscriptionService.getSubscriptionPlanBySlug(slug);
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
};

export const getActiveSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const result = await SubscriptionService.getActiveSubscriptionPlans();
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const updateSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await SubscriptionService.updateSubscriptionPlan(id, req.body);
    res.json({
      success: true,
      message: 'Subscription plan updated successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await SubscriptionService.deleteSubscriptionPlan(id);
    res.json({
      success: true,
      message: 'Subscription plan deleted successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// LemonSqueezy Webhook Handler
export const handleLemonSqueezyWebhook = async (req: Request, res: Response) => {
  try {
    // Verify webhook signature (implement based on LemonSqueezy docs)
    // const signature = req.headers['x-signature'];
    // if (!verifyWebhookSignature(req.body, signature)) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    const result = await SubscriptionService.handleLemonSqueezyWebhook(req.body);
    res.json({
      success: true,
      message: 'Webhook processed successfully',
      data: result
    });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Feature Access Check
export const checkFeatureAccess = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const { featureName } = req.params;
    const hasAccess = await SubscriptionService.checkFeatureAccess(userId, featureName);
    
    res.json({
      success: true,
      data: {
        hasAccess,
        featureName
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Admin endpoints for managing all subscriptions
export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const [subscriptions, total] = await Promise.all([
      SubscriptionService.getAllSubscriptions(where, { skip, take: Number(limit) }),
      SubscriptionService.getSubscriptionCount(where)
    ]);

    res.json({
      success: true,
      data: {
        subscriptions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 