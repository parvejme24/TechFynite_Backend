import { Router } from 'express';
import {
  createSubscription,
  getSubscriptionById,
  getUserSubscriptions,
  getUserActiveSubscription,
  updateSubscription,
  cancelSubscription,
  deleteSubscription,
  createSubscriptionPlan,
  getSubscriptionPlanById,
  getSubscriptionPlanBySlug,
  getActiveSubscriptionPlans,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  handleLemonSqueezyWebhook,
  checkFeatureAccess,
  getAllSubscriptions
} from './subscription.controller';
import { authenticate, requireAdmin } from '../auth/auth.middleware';

const router = Router();

// Public routes
router.get('/plans', getActiveSubscriptionPlans);
router.get('/plans/:slug', getSubscriptionPlanBySlug);
router.post('/webhook/lemonsqueezy', handleLemonSqueezyWebhook);

// Protected routes (require authentication)
router.get('/my-subscriptions', authenticate, getUserSubscriptions);
router.get('/my-active-subscription', authenticate, getUserActiveSubscription);
router.get('/check-feature/:featureName', authenticate, checkFeatureAccess);

// Admin routes (require admin role)
router.post('/subscriptions', authenticate, requireAdmin, createSubscription);
router.get('/subscriptions/:id', authenticate, requireAdmin, getSubscriptionById);
router.put('/subscriptions/:id', authenticate, requireAdmin, updateSubscription);
router.delete('/subscriptions/:id', authenticate, requireAdmin, deleteSubscription);
router.post('/subscriptions/:id/cancel', authenticate, requireAdmin, cancelSubscription);

router.post('/plans', authenticate, requireAdmin, createSubscriptionPlan);
router.get('/plans/:id', authenticate, requireAdmin, getSubscriptionPlanById);
router.put('/plans/:id', authenticate, requireAdmin, updateSubscriptionPlan);
router.delete('/plans/:id', authenticate, requireAdmin, deleteSubscriptionPlan);

// Admin management routes
router.get('/admin/subscriptions', authenticate, requireAdmin, getAllSubscriptions);

export default router; 