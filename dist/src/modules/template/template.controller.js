"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTemplate = exports.updateTemplate = exports.createTemplate = exports.getTemplateById = exports.getAllTemplates = void 0;
const template_service_1 = require("./template.service");
const getAllTemplates = async (req, res) => {
    try {
        const templates = await template_service_1.TemplateService.getAll();
        res.json(templates);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
};
exports.getAllTemplates = getAllTemplates;
const getTemplateById = async (req, res) => {
    try {
        const template = await template_service_1.TemplateService.getById(req.params.id);
        if (!template)
            return res.status(404).json({ error: 'Template not found' });
        res.json(template);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch template' });
    }
};
exports.getTemplateById = getTemplateById;
const createTemplate = async (req, res) => {
    try {
        const template = await template_service_1.TemplateService.create(req.body);
        res.status(201).json(template);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create template' });
    }
};
exports.createTemplate = createTemplate;
const updateTemplate = async (req, res) => {
    try {
        const template = await template_service_1.TemplateService.update(req.params.id, req.body);
        res.json(template);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update template' });
    }
};
exports.updateTemplate = updateTemplate;
const deleteTemplate = async (req, res) => {
    try {
        await template_service_1.TemplateService.delete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete template' });
    }
};
exports.deleteTemplate = deleteTemplate;
