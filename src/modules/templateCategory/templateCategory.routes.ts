import { Router } from 'express';
import {
  getAllTemplateCategories,
  getTemplateCategoryById,
  createTemplateCategory,
  updateTemplateCategory,
  deleteTemplateCategory,
} from './templateCategory.controller';
import { uploadTemplateCategoryImage } from '../../middlewares/upload';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

router.get('/template-categories', getAllTemplateCategories);
router.get('/template-categories/:id', getTemplateCategoryById);
router.post('/template-categories', authMiddleware, uploadTemplateCategoryImage.single('image'), createTemplateCategory);
router.put('/template-categories/:id', authMiddleware, uploadTemplateCategoryImage.single('image'), updateTemplateCategory);
router.delete('/template-categories/:id', authMiddleware, deleteTemplateCategory);

export default router;
