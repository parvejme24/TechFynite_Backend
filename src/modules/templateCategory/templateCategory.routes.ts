import { Router } from 'express';
import {
  getAllTemplateCategories,
  getTemplateCategoryById,
  createTemplateCategory,
  updateTemplateCategory,
  deleteTemplateCategory,
} from './templateCategory.controller';

const router = Router();

router.get('/template-categories', getAllTemplateCategories);
router.get('/template-categories/:id', getTemplateCategoryById);
router.post('/template-categories', createTemplateCategory);
router.put('/template-categories/:id', updateTemplateCategory);
router.delete('/template-categories/:id', deleteTemplateCategory);

export default router; 