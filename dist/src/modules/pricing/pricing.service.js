"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingService = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
class PricingService {
    // Create a new pricing plan
    async createPricing(data) {
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
            return pricing;
        }
        catch (error) {
            throw new Error(`Failed to create pricing plan: ${error}`);
        }
    }
    // Get all pricing plans
    async getAllPricing() {
        try {
            const pricingPlans = await prisma.pricing.findMany({
                orderBy: { createdAt: 'desc' },
            });
            return pricingPlans;
        }
        catch (error) {
            throw new Error(`Failed to fetch pricing plans: ${error}`);
        }
    }
    // Get pricing plan by ID
    async getPricingById(id) {
        try {
            const pricing = await prisma.pricing.findUnique({
                where: { id },
            });
            return pricing;
        }
        catch (error) {
            throw new Error(`Failed to fetch pricing plan: ${error}`);
        }
    }
    // Update pricing plan
    async updatePricing(id, data) {
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
            return pricing;
        }
        catch (error) {
            throw new Error(`Failed to update pricing plan: ${error}`);
        }
    }
    // Delete pricing plan
    async deletePricing(id) {
        try {
            await prisma.pricing.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            throw new Error(`Failed to delete pricing plan: ${error}`);
        }
    }
    // Check if pricing plan exists
    async pricingExists(id) {
        try {
            const count = await prisma.pricing.count({
                where: { id },
            });
            return count > 0;
        }
        catch (error) {
            throw new Error(`Failed to check pricing plan existence: ${error}`);
        }
    }
}
exports.PricingService = PricingService;
