"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const template_controller_1 = require("./template.controller");
const upload_1 = require("../../middlewares/upload");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// Public routes (no authentication required)
router.get('/templates', template_controller_1.getAllTemplates);
router.get('/templates/:id', template_controller_1.getTemplateById);
router.get('/templates/:slug', template_controller_1.getTemplateBySlug);
router.get('/templates/category/:id', template_controller_1.getTemplatesByCategory);
// Admin routes (require admin/super admin authentication)
router.post('/templates', auth_1.authMiddleware, auth_1.adminOrSuperAdminOnly, upload_1.uploadTemplateFiles, template_controller_1.createTemplate);
router.put('/templates/:id', auth_1.authMiddleware, auth_1.adminOrSuperAdminOnly, upload_1.uploadTemplateFiles, template_controller_1.updateTemplate);
router.delete('/templates/:id', auth_1.authMiddleware, auth_1.adminOrSuperAdminOnly, template_controller_1.deleteTemplate);
router.post('/templates/ls-sync/:id', auth_1.authMiddleware, auth_1.adminOrSuperAdminOnly, template_controller_1.syncWithLemonSqueezy);
exports.default = router;
