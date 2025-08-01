import { Router } from 'express';
import {
  getAllTemplates,
  getTemplateById,
  getTemplateBySlug,
  getTemplatesByCategory,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  syncWithLemonSqueezy,
} from './template.controller';
import { 
  uploadTemplateFiles
} from '../../middlewares/upload';
import { authMiddleware, adminOrSuperAdminOnly } from '../../middlewares/auth';

const router = Router();

// Public routes (no authentication required)
router.get('/templates', getAllTemplates);
router.get('/templates/:id', getTemplateById);
router.get('/templates/:slug', getTemplateBySlug);
router.get('/templates/category/:id', getTemplatesByCategory);

// Admin routes (require admin/super admin authentication)
router.post('/templates', authMiddleware, adminOrSuperAdminOnly,
  uploadTemplateFiles,
  createTemplate
);
router.put('/templates/:id', authMiddleware, adminOrSuperAdminOnly,
  uploadTemplateFiles,
  updateTemplate
);
router.delete('/templates/:id', authMiddleware, adminOrSuperAdminOnly, deleteTemplate);
router.post('/templates/ls-sync/:id', authMiddleware, adminOrSuperAdminOnly, syncWithLemonSqueezy);

export default router;
