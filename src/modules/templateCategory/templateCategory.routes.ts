import { Router } from 'express';
import {
  getAllTemplateCategories,
  getTemplateCategoryById,
  createTemplateCategory,
  updateTemplateCategory,
  deleteTemplateCategory,
} from './templateCategory.controller';
import { upload } from '../../middlewares/upload';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

router.get('/template-categories', getAllTemplateCategories);
router.get('/template-categories/:id', getTemplateCategoryById);
router.post('/template-categories', authMiddleware, upload.single('image'), createTemplateCategory);
router.put('/template-categories/:id', authMiddleware, upload.single('image'), updateTemplateCategory);
router.delete('/template-categories/:id', authMiddleware, deleteTemplateCategory);

export default router;
