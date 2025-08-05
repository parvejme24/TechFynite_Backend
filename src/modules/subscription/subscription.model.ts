import { prisma } from '../../config/database';
// Define enums locally since they're not being generated properly
enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  UNPAID = 'UNPAID',
  TRIAL = 'TRIAL',
  EXPIRED = 'EXPIRED'
}

enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export class SubscriptionModel {
  // Subscription operations
  static async create(data: any) {
    return await prisma.subscription.create({
      data,
      include: {
        subscriptionFeatures: true,
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  static async findById(id: string) {
    return await prisma.subscription.findUnique({
      where: { id },
      include: {
        subscriptionFeatures: true,
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  static async findBySubscriptionId(subscriptionId: string) {
    return await prisma.subscription.findUnique({
      where: { subscriptionId },
      include: {
        subscriptionFeatures: true,
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  static async findByUserId(userId: string) {
    return await prisma.subscription.findMany({
      where: { userId },
      include: {
        subscriptionFeatures: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findActiveByUserId(userId: string) {
    return await prisma.subscription.findFirst({
      where: { 
        userId,
        status: SubscriptionStatus.ACTIVE
      },
      include: {
        subscriptionFeatures: true
      }
    });
  }

  static async update(id: string, data: any) {
    return await prisma.subscription.update({
      where: { id },
      data,
      include: {
        subscriptionFeatures: true,
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  static async updateBySubscriptionId(subscriptionId: string, data: any) {
    return await prisma.subscription.update({
      where: { subscriptionId },
      data,
      include: {
        subscriptionFeatures: true,
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  static async delete(id: string) {
    return await prisma.subscription.delete({
      where: { id }
    });
  }

  static async findMany(where: any = {}, options: any = {}) {
    return await prisma.subscription.findMany({
      where,
      ...options,
      include: {
        subscriptionFeatures: true,
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  static async count(where: any = {}) {
    return await prisma.subscription.count({ where });
  }

  // Subscription Feature operations
  static async createFeature(data: any) {
    return await prisma.subscriptionFeature.create({
      data
    });
  }

  static async updateFeature(id: string, data: any) {
    return await prisma.subscriptionFeature.update({
      where: { id },
      data
    });
  }

  static async deleteFeature(id: string) {
    return await prisma.subscriptionFeature.delete({
      where: { id }
    });
  }

  static async findFeaturesBySubscriptionId(subscriptionId: string) {
    return await prisma.subscriptionFeature.findMany({
      where: { subscriptionId }
    });
  }
}

export class SubscriptionPlanModel {
  static async create(data: any) {
    return await prisma.subscriptionPlan.create({
      data
    });
  }

  static async findById(id: string) {
    return await prisma.subscriptionPlan.findUnique({
      where: { id }
    });
  }

  static async findBySlug(slug: string) {
    return await prisma.subscriptionPlan.findUnique({
      where: { slug }
    });
  }

  static async findByLemonSqueezyProductId(lemonsqueezyProductId: string) {
    return await prisma.subscriptionPlan.findUnique({
      where: { lemonsqueezyProductId }
    });
  }

  static async findActive() {
    return await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });
  }

  static async update(id: string, data: any) {
    return await prisma.subscriptionPlan.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    return await prisma.subscriptionPlan.delete({
      where: { id }
    });
  }

  static async findMany(where: any = {}, options: any = {}) {
    return await prisma.subscriptionPlan.findMany({
      where,
      ...options
    });
  }

  static async count(where: any = {}) {
    return await prisma.subscriptionPlan.count({ where });
  }
} 