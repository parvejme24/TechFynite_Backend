import { Router } from 'express';
import {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplateStats,
  downloadSourceFile,
} from './template.controller';
import { uploadTemplateImageCloudinary, handleUploadError } from '../../middleware/cloudinary-upload';
import { authenticateAdminAndCheckStatus } from '../../middleware/authMiddleware';
import {
  validateCreateTemplate,
  validateUpdateTemplate,
  validateTemplateId,
  validateTemplateQuery,
} from './template.validate';

const router = Router();

// Public routes
router.get('/templates', validateTemplateQuery, getAllTemplates);
router.get('/templates/stats', getTemplateStats);
router.get('/templates/:id', validateTemplateId, getTemplateById);

// Admin routes
router.post('/templates', authenticateAdminAndCheckStatus, (req: any, res: any, next: any) => {
  // Check if there's a file upload
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    (uploadTemplateImageCloudinary as any)(req, res, (err: any) => {
      if (err) return handleUploadError(err, req, res, next);
      return next();
    });
  } else {
    // No file upload, proceed directly
    return next();
  }
}, validateCreateTemplate, createTemplate);

router.put('/templates/:id', authenticateAdminAndCheckStatus, validateTemplateId, (req: any, res: any, next: any) => {
  // Check if there's a file upload
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    (uploadTemplateImageCloudinary as any)(req, res, (err: any) => {
      if (err) return handleUploadError(err, req, res, next);
      return next();
    });
  } else {
    // No file upload, proceed directly
    return next();
  }
}, validateUpdateTemplate, updateTemplate);

router.delete('/templates/:id', authenticateAdminAndCheckStatus, validateTemplateId, deleteTemplate);

// Download source file route
router.get('/templates/:templateId/download/:fileIndex', downloadSourceFile);

export default router;
