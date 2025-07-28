import { Request, Response } from "express";
import { PricingService } from "./pricing.service";
import { createPricingSchema, updatePricingSchema } from "./pricing.types";

const pricingService = new PricingService();

export class PricingController {
  // Create a new pricing plan
  async createPricing(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = createPricingSchema.parse(req.body);

      const pricing = await pricingService.createPricing(validatedData);

      res.status(201).json(pricing);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || "Failed to create pricing plan",
      });
    }
  }

  // Get all pricing plans
  async getAllPricing(req: Request, res: Response) {
    try {
      const pricingPlans = await pricingService.getAllPricing();

      res.status(200).json(pricingPlans);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve pricing plans",
      });
    }
  }

  // Get pricing plan by ID
  async getPricingById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const pricing = await pricingService.getPricingById(id);

      if (!pricing) {
        return res.status(404).json({
          success: false,
          message: "Pricing plan not found",
        });
      }

      res.status(200).json(pricing);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve pricing plan",
      });
    }
  }

  // Update pricing plan
  async updatePricing(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if pricing plan exists
      const exists = await pricingService.pricingExists(id);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: "Pricing plan not found",
        });
      }

      // Validate request body
      const validatedData = updatePricingSchema.parse(req.body);

      const pricing = await pricingService.updatePricing(id, validatedData);

      res.status(200).json(pricing);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || "Failed to update pricing plan",
      });
    }
  }

  // Delete pricing plan
  async deletePricing(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if pricing plan exists
      const exists = await pricingService.pricingExists(id);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: "Pricing plan not found",
        });
      }

      await pricingService.deletePricing(id);

      res.status(200).json({
        success: true,
        message: "Pricing plan deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete pricing plan",
      });
    }
  }


}
