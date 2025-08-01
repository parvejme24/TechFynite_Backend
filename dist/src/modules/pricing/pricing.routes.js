"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pricing_controller_1 = require("./pricing.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
const pricingController = new pricing_controller_1.PricingController();
// Public routes
router.get('/pricing', pricingController.getAllPricing.bind(pricingController));
router.get('/pricing/:id', pricingController.getPricingById.bind(pricingController));
// Protected routes (Admin only)
router.post('/pricing', auth_1.authMiddleware, pricingController.createPricing.bind(pricingController));
router.put('/pricing/:id', auth_1.authMiddleware, pricingController.updatePricing.bind(pricingController));
router.delete('/pricing/:id', auth_1.authMiddleware, pricingController.deletePricing.bind(pricingController));
exports.default = router;
