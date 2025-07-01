import { Router } from 'express';
import {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from './template.controller';
import { authMiddleware, adminOnly } from '../../middlewares/auth';

const router = Router();

router.get('/templates', getAllTemplates);
router.get('/templates/:id', getTemplateById);
router.post('/templates', authMiddleware, adminOnly, createTemplate);
router.put('/templates/:id', authMiddleware, adminOnly, updateTemplate);
router.delete('/templates/:id', authMiddleware, adminOnly, deleteTemplate);

export default router; 