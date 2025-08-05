export interface CreateSubscriptionRequest {
  userId: string;
  lemonsqueezyStoreId: string;
  lemonsqueezyProductId: string;
  lemonsqueezyVariantId: string;
  lemonsqueezyOrderId: string;
  lemonsqueezyOrderItemId: string;
  subscriptionId: string;
  planName: string;
  planPrice: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEndsAt?: Date;
}

export interface UpdateSubscriptionRequest {
  status?: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID' | 'TRIAL' | 'EXPIRED';
  cancelAtPeriodEnd?: boolean;
  canceledAt?: Date;
  endedAt?: Date;
  nextBillingDate?: Date;
  totalRevenue?: number;
}

export interface SubscriptionResponse {
  id: string;
  userId: string;
  subscriptionId: string;
  status: string;
  planName: string;
  planPrice: number;
  billingCycle: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEndsAt?: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  endedAt?: Date;
  nextBillingDate?: Date;
  totalRevenue: number;
  createdAt: Date;
  updatedAt: Date;
  features: SubscriptionFeatureResponse[];
}

export interface SubscriptionFeatureResponse {
  id: string;
  featureName: string;
  featureValue: string;
  isActive: boolean;
}

export interface CreateSubscriptionPlanRequest {
  name: string;
  slug: string;
  description?: string;
  lemonsqueezyProductId: string;
  lemonsqueezyVariantId: string;
  price: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  isActive?: boolean;
  isPopular?: boolean;
  features: any[];
  maxTemplates?: number;
  maxDownloads?: number;
  prioritySupport?: boolean;
}

export interface SubscriptionPlanResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  billingCycle: string;
  isActive: boolean;
  isPopular: boolean;
  features: any[];
  maxTemplates?: number;
  maxDownloads?: number;
  prioritySupport: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LemonSqueezyWebhookData {
  event_name: string;
  data: {
    id: string;
    type: string;
    attributes: {
      store_id: number;
      customer_id: number;
      order_id: number;
      order_item_id: number;
      product_id: number;
      variant_id: number;
      subscription_id: number;
      status: string;
      current_period_start: string;
      current_period_end: string;
      trial_ends_at?: string;
      ends_at?: string;
      renews_at?: string;
      total_revenue: number;
      [key: string]: any;
    };
  };
} 