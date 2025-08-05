import { SubscriptionModel, SubscriptionPlanModel } from './subscription.model';
import { 
  CreateSubscriptionRequest, 
  UpdateSubscriptionRequest, 
  CreateSubscriptionPlanRequest,
  LemonSqueezyWebhookData 
} from './subscription.types';
// Define enums locally since they're not being generated properly
enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  UNPAID = 'UNPAID',
  TRIAL = 'TRIAL',
  EXPIRED = 'EXPIRED'
}
import { prisma } from '../../config/database';

export class SubscriptionService {
  // Subscription Management
  static async createSubscription(data: CreateSubscriptionRequest) {
    const subscription = await SubscriptionModel.create(data);
    
    // Add default features based on plan
    await this.addDefaultFeatures(subscription.id, data.planName);
    
    return subscription;
  }

  static async getSubscriptionById(id: string) {
    const subscription = await SubscriptionModel.findById(id);
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    return subscription;
  }

  static async getSubscriptionBySubscriptionId(subscriptionId: string) {
    const subscription = await SubscriptionModel.findBySubscriptionId(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    return subscription;
  }

  static async getUserSubscriptions(userId: string) {
    return await SubscriptionModel.findByUserId(userId);
  }

  static async getUserActiveSubscription(userId: string) {
    return await SubscriptionModel.findActiveByUserId(userId);
  }

  static async updateSubscription(id: string, data: UpdateSubscriptionRequest) {
    const subscription = await SubscriptionModel.findById(id);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    return await SubscriptionModel.update(id, data);
  }

  static async cancelSubscription(id: string) {
    const subscription = await SubscriptionModel.findById(id);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    return await SubscriptionModel.update(id, {
      cancelAtPeriodEnd: true,
      canceledAt: new Date()
    });
  }

  static async deleteSubscription(id: string) {
    const subscription = await SubscriptionModel.findById(id);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    return await SubscriptionModel.delete(id);
  }

  static async getAllSubscriptions(where: any = {}, options: any = {}) {
    return await SubscriptionModel.findMany(where, options);
  }

  static async getSubscriptionCount(where: any = {}) {
    return await SubscriptionModel.count(where);
  }

  // Subscription Plan Management
  static async createSubscriptionPlan(data: CreateSubscriptionPlanRequest) {
    return await SubscriptionPlanModel.create(data);
  }

  static async getSubscriptionPlanById(id: string) {
    const plan = await SubscriptionPlanModel.findById(id);
    if (!plan) {
      throw new Error('Subscription plan not found');
    }
    return plan;
  }

  static async getSubscriptionPlanBySlug(slug: string) {
    const plan = await SubscriptionPlanModel.findBySlug(slug);
    if (!plan) {
      throw new Error('Subscription plan not found');
    }
    return plan;
  }

  static async getActiveSubscriptionPlans() {
    return await SubscriptionPlanModel.findActive();
  }

  static async updateSubscriptionPlan(id: string, data: any) {
    const plan = await SubscriptionPlanModel.findById(id);
    if (!plan) {
      throw new Error('Subscription plan not found');
    }

    return await SubscriptionPlanModel.update(id, data);
  }

  static async deleteSubscriptionPlan(id: string) {
    const plan = await SubscriptionPlanModel.findById(id);
    if (!plan) {
      throw new Error('Subscription plan not found');
    }

    return await SubscriptionPlanModel.delete(id);
  }

  // LemonSqueezy Webhook Handler
  static async handleLemonSqueezyWebhook(webhookData: LemonSqueezyWebhookData) {
    const { event_name, data } = webhookData;
    const { attributes } = data;

    switch (event_name) {
      case 'subscription_created':
        return await this.handleSubscriptionCreated(attributes);
      
      case 'subscription_updated':
        return await this.handleSubscriptionUpdated(attributes);
      
      case 'subscription_cancelled':
        return await this.handleSubscriptionCancelled(attributes);
      
      case 'subscription_resumed':
        return await this.handleSubscriptionResumed(attributes);
      
      case 'subscription_expired':
        return await this.handleSubscriptionExpired(attributes);
      
      default:
        console.log(`Unhandled webhook event: ${event_name}`);
        return { message: 'Event not handled' };
    }
  }

  private static async handleSubscriptionCreated(attributes: any) {
    // Find user by LemonSqueezy customer ID
    const user = await this.findUserByLemonSqueezyCustomerId(attributes.customer_id);
    if (!user) {
      throw new Error('User not found for customer ID');
    }

    const subscriptionData = {
      userId: user.id,
      lemonsqueezyStoreId: attributes.store_id.toString(),
      lemonsqueezyProductId: attributes.product_id.toString(),
      lemonsqueezyVariantId: attributes.variant_id.toString(),
      lemonsqueezyOrderId: attributes.order_id.toString(),
      lemonsqueezyOrderItemId: attributes.order_item_id.toString(),
      subscriptionId: attributes.subscription_id.toString(),
      planName: await this.getPlanNameByProductId(attributes.product_id),
      planPrice: attributes.total_revenue / 100, // Convert from cents
      billingCycle: this.getBillingCycleFromVariant(attributes.variant_id),
      currentPeriodStart: new Date(attributes.current_period_start),
      currentPeriodEnd: new Date(attributes.current_period_end),
      trialEndsAt: attributes.trial_ends_at ? new Date(attributes.trial_ends_at) : undefined,
      status: this.mapLemonSqueezyStatus(attributes.status),
      totalRevenue: attributes.total_revenue / 100
    };

    return await this.createSubscription(subscriptionData);
  }

  private static async handleSubscriptionUpdated(attributes: any) {
    const subscription = await SubscriptionModel.findBySubscriptionId(attributes.subscription_id.toString());
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const updateData = {
      status: this.mapLemonSqueezyStatus(attributes.status),
      currentPeriodStart: new Date(attributes.current_period_start),
      currentPeriodEnd: new Date(attributes.current_period_end),
      trialEndsAt: attributes.trial_ends_at ? new Date(attributes.trial_ends_at) : undefined,
      nextBillingDate: attributes.renews_at ? new Date(attributes.renews_at) : undefined,
      totalRevenue: attributes.total_revenue / 100
    };

    return await SubscriptionModel.updateBySubscriptionId(attributes.subscription_id.toString(), updateData);
  }

  private static async handleSubscriptionCancelled(attributes: any) {
    const subscription = await SubscriptionModel.findBySubscriptionId(attributes.subscription_id.toString());
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    return await SubscriptionModel.updateBySubscriptionId(attributes.subscription_id.toString(), {
      status: SubscriptionStatus.CANCELED,
      cancelAtPeriodEnd: true,
      canceledAt: new Date(),
      endedAt: attributes.ends_at ? new Date(attributes.ends_at) : null
    });
  }

  private static async handleSubscriptionResumed(attributes: any) {
    const subscription = await SubscriptionModel.findBySubscriptionId(attributes.subscription_id.toString());
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    return await SubscriptionModel.updateBySubscriptionId(attributes.subscription_id.toString(), {
      status: SubscriptionStatus.ACTIVE,
      cancelAtPeriodEnd: false,
      canceledAt: null,
      endedAt: null
    });
  }

  private static async handleSubscriptionExpired(attributes: any) {
    const subscription = await SubscriptionModel.findBySubscriptionId(attributes.subscription_id.toString());
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    return await SubscriptionModel.updateBySubscriptionId(attributes.subscription_id.toString(), {
      status: SubscriptionStatus.EXPIRED,
      endedAt: new Date()
    });
  }

  // Helper methods
  private static async addDefaultFeatures(subscriptionId: string, planName: string) {
    const defaultFeatures = this.getDefaultFeaturesByPlan(planName);
    
    for (const feature of defaultFeatures) {
      await SubscriptionModel.createFeature({
        subscriptionId,
        featureName: feature.name,
        featureValue: feature.value,
        isActive: true
      });
    }
  }

  private static getDefaultFeaturesByPlan(planName: string) {
    const features: { [key: string]: any[] } = {
      'Free': [
        { name: 'max_templates', value: '5' },
        { name: 'max_downloads', value: '10' },
        { name: 'priority_support', value: 'false' }
      ],
      'Pro': [
        { name: 'max_templates', value: '50' },
        { name: 'max_downloads', value: '100' },
        { name: 'priority_support', value: 'true' },
        { name: 'advanced_analytics', value: 'true' }
      ],
      'Enterprise': [
        { name: 'max_templates', value: 'unlimited' },
        { name: 'max_downloads', value: 'unlimited' },
        { name: 'priority_support', value: 'true' },
        { name: 'advanced_analytics', value: 'true' },
        { name: 'custom_branding', value: 'true' },
        { name: 'api_access', value: 'true' }
      ]
    };

    return features[planName] || features['Free'];
  }

  private static mapLemonSqueezyStatus(lsStatus: string): SubscriptionStatus {
    const statusMap: { [key: string]: SubscriptionStatus } = {
      'active': SubscriptionStatus.ACTIVE,
      'past_due': SubscriptionStatus.PAST_DUE,
      'canceled': SubscriptionStatus.CANCELED,
      'unpaid': SubscriptionStatus.UNPAID,
      'trialing': SubscriptionStatus.TRIAL,
      'expired': SubscriptionStatus.EXPIRED
    };

    return statusMap[lsStatus] || SubscriptionStatus.ACTIVE;
  }

  private static async findUserByLemonSqueezyCustomerId(customerId: number) {
    // This would need to be implemented based on how you store LemonSqueezy customer IDs
    // You might need to add a lemonsqueezyCustomerId field to your User model
    return await prisma.user.findFirst({
      where: { 
        // Add your customer ID field here
        // lemonsqueezyCustomerId: customerId.toString()
      }
    });
  }

  private static async getPlanNameByProductId(productId: number): Promise<string> {
    const plan = await SubscriptionPlanModel.findByLemonSqueezyProductId(productId.toString());
    return plan?.name || 'Free';
  }

  private static getBillingCycleFromVariant(variantId: number): 'MONTHLY' | 'YEARLY' {
    // This would need to be implemented based on your variant mapping
    // You might store this mapping in your SubscriptionPlan model
    return 'MONTHLY'; // Default fallback
  }

  // Feature Access Control
  static async checkFeatureAccess(userId: string, featureName: string): Promise<boolean> {
    const activeSubscription = await this.getUserActiveSubscription(userId);
    if (!activeSubscription) {
      return false;
    }

    const feature = activeSubscription.subscriptionFeatures.find(
      (f: any) => f.featureName === featureName && f.isActive
    );

    if (!feature) {
      return false;
    }

    if (feature.featureValue === 'true') {
      return true;
    }

    if (feature.featureValue === 'unlimited') {
      return true;
    }

    // For numeric limits, you'd need to check current usage
    const limit = parseInt(feature.featureValue);
    if (isNaN(limit)) {
      return false;
    }

    // Check current usage (implement based on your needs)
    const currentUsage = await this.getCurrentFeatureUsage(userId, featureName);
    return currentUsage < limit;
  }

  private static async getCurrentFeatureUsage(userId: string, featureName: string): Promise<number> {
    // Implement based on your specific features
    // For example, for max_templates, count user's template downloads
    switch (featureName) {
      case 'max_templates':
        return await prisma.template.count({
          where: { purchasedBy: { some: { id: userId } } }
        });
      case 'max_downloads':
        return await prisma.orderInvoice.count({
          where: { userId }
        });
      default:
        return 0;
    }
  }
} 