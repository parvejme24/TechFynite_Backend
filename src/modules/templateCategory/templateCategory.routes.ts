import { Router } from 'express';
import {
  getAllTemplateCategories,
  getTemplateCategoryById,
  createTemplateCategory,
  updateTemplateCategory,
  deleteTemplateCategory,
} from './templateCategory.controller';
import { authMiddleware, adminOnly } from '../../middlewares/auth';

const router = Router();

router.get('/template-categories', getAllTemplateCategories);
router.get('/template-categories/:id', getTemplateCategoryById);
router.post('/template-categories', authMiddleware, adminOnly, createTemplateCategory);
router.put('/template-categories/:id', authMiddleware, adminOnly, updateTemplateCategory);
router.delete('/template-categories/:id', authMiddleware, adminOnly, deleteTemplateCategory);

export default router; 