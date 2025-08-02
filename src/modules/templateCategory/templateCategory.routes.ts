import { Router } from 'express';
import {
  getAllTemplateCategories,
  getTemplateCategoryById,
  createTemplateCategory,
  updateTemplateCategory,
  deleteTemplateCategory,
} from './templateCategory.controller';
import { uploadCategoryImageCloudinary } from '../../middlewares/cloudinary-upload';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

router.get('/template-categories', getAllTemplateCategories);
router.get('/template-categories/:id', getTemplateCategoryById);
router.post('/template-categories', authMiddleware, uploadCategoryImageCloudinary, createTemplateCategory);
router.put('/template-categories/:id', authMiddleware, uploadCategoryImageCloudinary, updateTemplateCategory);
router.delete('/template-categories/:id', authMiddleware, deleteTemplateCategory);

export default router;
