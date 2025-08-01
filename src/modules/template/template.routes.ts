import { Router } from 'express';
import {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from './template.controller';
import { 
  uploadTemplateImage, 
  uploadTemplateFile, 
  uploadTemplateScreenshots 
} from '../../middlewares/upload';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

router.get('/templates', getAllTemplates);
router.get('/templates/:id', getTemplateById);
router.post('/templates', authMiddleware, 
  uploadTemplateImage.single('image'),
  uploadTemplateFile.single('templateFile'),
  uploadTemplateScreenshots.array('screenshots', 10),
  createTemplate
);
router.put('/templates/:id', authMiddleware, 
  uploadTemplateImage.single('image'),
  uploadTemplateFile.single('templateFile'),
  uploadTemplateScreenshots.array('screenshots', 10),
  updateTemplate
);
router.delete('/templates/:id', authMiddleware, deleteTemplate);

export default router;
