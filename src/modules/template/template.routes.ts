import { Router } from 'express';
import {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from './template.controller';
import { authMiddleware, adminOrSuperAdminOnly } from '../../middlewares/auth';

const router = Router();

router.get('/templates', getAllTemplates);
router.get('/templates/:id', getTemplateById);
router.post('/templates', authMiddleware, adminOrSuperAdminOnly, createTemplate);
router.put('/templates/:id', authMiddleware, adminOrSuperAdminOnly, updateTemplate);
router.delete('/templates/:id', authMiddleware, adminOrSuperAdminOnly, deleteTemplate);

export default router; 