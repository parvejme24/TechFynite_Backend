"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingController = void 0;
const pricing_service_1 = require("./pricing.service");
const pricing_types_1 = require("./pricing.types");
const pricingService = new pricing_service_1.PricingService();
class PricingController {
    // Create a new pricing plan
    async createPricing(req, res) {
        try {
            // Validate request body
            const validatedData = pricing_types_1.createPricingSchema.parse(req.body);
            const pricing = await pricingService.createPricing(validatedData);
            res.status(201).json(pricing);
        }
        catch (error) {
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
    async getAllPricing(req, res) {
        try {
            const pricingPlans = await pricingService.getAllPricing();
            res.status(200).json(pricingPlans);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve pricing plans",
            });
        }
    }
    // Get pricing plan by ID
    async getPricingById(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to retrieve pricing plan",
            });
        }
    }
    // Update pricing plan
    async updatePricing(req, res) {
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
            const validatedData = pricing_types_1.updatePricingSchema.parse(req.body);
            const pricing = await pricingService.updatePricing(id, validatedData);
            res.status(200).json(pricing);
        }
        catch (error) {
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
    async deletePricing(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to delete pricing plan",
            });
        }
    }
}
exports.PricingController = PricingController;
