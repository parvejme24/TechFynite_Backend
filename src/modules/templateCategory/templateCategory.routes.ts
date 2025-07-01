import { Router } from 'express';
import {
  getAllTemplateCategories,
  getTemplateCategoryById,
  createTemplateCategory,
  updateTemplateCategory,
  deleteTemplateCategory,
} from './templateCategory.controller';
import { authMiddleware, adminOrSuperAdminOnly } from '../../middlewares/auth';

const router = Router();

router.get('/template-categories', getAllTemplateCategories);
router.get('/template-categories/:id', getTemplateCategoryById);
router.post('/template-categories', authMiddleware, adminOrSuperAdminOnly, createTemplateCategory);
router.put('/template-categories/:id', authMiddleware, adminOrSuperAdminOnly, updateTemplateCategory);
router.delete('/template-categories/:id', authMiddleware, adminOrSuperAdminOnly, deleteTemplateCategory);

export default router; 