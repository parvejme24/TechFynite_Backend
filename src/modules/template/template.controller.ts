import { Request, Response } from 'express';
import { TemplateService } from './template.service';

export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await TemplateService.getAll();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
};

export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const template = await TemplateService.getById(req.params.id);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
};

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const template = await TemplateService.create(req.body);
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create template' });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const template = await TemplateService.update(req.params.id, req.body);
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update template' });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    await TemplateService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete template' });
  }
}; 