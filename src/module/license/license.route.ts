import { Router } from 'express';
import {
  getAllLicenses,
  getLicenseById,
  validateLicense,
  revokeLicense,
  getLicenseStats,
  getUserLicenses,
} from './license.controller';
import { authenticateUser, authenticateAdminAndCheckStatus } from '../../middleware/authMiddleware';
import {
  validateLicenseKey,
  validateRevokeLicense,
  validateLicenseId,
  validateLicenseQuery,
} from './license.validate';

const router = Router();

// Public routes
router.get('/licenses', validateLicenseQuery, getAllLicenses);
router.get('/licenses/stats', getLicenseStats);
router.get('/licenses/:id', validateLicenseId, getLicenseById);
router.post('/licenses/validate', validateLicenseKey, validateLicense);

// User routes
router.get('/user/licenses', authenticateUser, validateLicenseQuery, getUserLicenses);

// Admin routes
router.patch('/licenses/:id/revoke', authenticateAdminAndCheckStatus, validateLicenseId, validateRevokeLicense, revokeLicense);

export default router;
