import { PrismaClient } from '../../generated/prisma';
import { CreatePricingRequest, UpdatePricingRequest, PricingResponse } from './pricing.types';

const prisma = new PrismaClient();

export class PricingService {
  // Create a new pricing plan
  async createPricing(data: CreatePricingRequest): Promise<PricingResponse> {
    try {
      const pricing = await prisma.pricing.create({
        data: {
          title: data.title,
          price: data.price,
          license: data.license,
          duration: data.duration,
          features: data.features,
        },
      });

      return pricing as PricingResponse;
    } catch (error) {
      throw new Error(`Failed to create pricing plan: ${error}`);
    }
  }

  // Get all pricing plans
  async getAllPricing(): Promise<PricingResponse[]> {
    try {
      const pricingPlans = await prisma.pricing.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return pricingPlans as PricingResponse[];
    } catch (error) {
      throw new Error(`Failed to fetch pricing plans: ${error}`);
    }
  }

  // Get pricing plan by ID
  async getPricingById(id: string): Promise<PricingResponse | null> {
    try {
      const pricing = await prisma.pricing.findUnique({
        where: { id },
      });

      return pricing as PricingResponse | null;
    } catch (error) {
      throw new Error(`Failed to fetch pricing plan: ${error}`);
    }
  }

  // Update pricing plan
  async updatePricing(id: string, data: UpdatePricingRequest): Promise<PricingResponse> {
    try {
      const pricing = await prisma.pricing.update({
        where: { id },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.price !== undefined && { price: data.price }),
          ...(data.license && { license: data.license }),
          ...(data.duration && { duration: data.duration }),
          ...(data.features && { features: data.features }),
        },
      });

      return pricing as PricingResponse;
    } catch (error) {
      throw new Error(`Failed to update pricing plan: ${error}`);
    }
  }

  // Delete pricing plan
  async deletePricing(id: string): Promise<boolean> {
    try {
      await prisma.pricing.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to delete pricing plan: ${error}`);
    }
  }





  // Check if pricing plan exists
  async pricingExists(id: string): Promise<boolean> {
    try {
      const count = await prisma.pricing.count({
        where: { id },
      });

      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check pricing plan existence: ${error}`);
    }
  }
} 