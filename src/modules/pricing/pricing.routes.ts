import { Router } from 'express';
import { PricingController } from './pricing.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();
const pricingController = new PricingController();

// Public routes
router.get('/pricing', pricingController.getAllPricing.bind(pricingController));
router.get('/pricing/:id', pricingController.getPricingById.bind(pricingController));

// Protected routes (Admin only)
router.post('/pricing', authMiddleware, pricingController.createPricing.bind(pricingController));
router.put('/pricing/:id', authMiddleware, pricingController.updatePricing.bind(pricingController));
router.delete('/pricing/:id', authMiddleware, pricingController.deletePricing.bind(pricingController));

export default router; 