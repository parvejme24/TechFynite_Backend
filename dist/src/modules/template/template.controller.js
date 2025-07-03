"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTemplate = exports.updateTemplate = exports.createTemplate = exports.getTemplateById = exports.getAllTemplates = void 0;
const template_service_1 = require("./template.service");
const getAllTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templates = yield template_service_1.TemplateService.getAll();
        res.json(templates);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});
exports.getAllTemplates = getAllTemplates;
const getTemplateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const template = yield template_service_1.TemplateService.getById(req.params.id);
        if (!template)
            return res.status(404).json({ error: 'Template not found' });
        res.json(template);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch template' });
    }
});
exports.getTemplateById = getTemplateById;
const createTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const template = yield template_service_1.TemplateService.create(req.body);
        res.status(201).json(template);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create template' });
    }
});
exports.createTemplate = createTemplate;
const updateTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const template = yield template_service_1.TemplateService.update(req.params.id, req.body);
        res.json(template);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update template' });
    }
});
exports.updateTemplate = updateTemplate;
const deleteTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield template_service_1.TemplateService.delete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete template' });
    }
});
exports.deleteTemplate = deleteTemplate;
