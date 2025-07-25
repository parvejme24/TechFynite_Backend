import { Router } from 'express';
import {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from './template.controller';
import { upload } from '../../middlewares/upload';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

router.get('/templates', getAllTemplates);
router.get('/templates/:id', getTemplateById);
router.post('/templates', authMiddleware, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'screenshots', maxCount: 10 }
]), createTemplate);
router.put('/templates/:id', authMiddleware, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'screenshots', maxCount: 10 }
]), updateTemplate);
router.delete('/templates/:id', authMiddleware, deleteTemplate);

export default router;
