import { Request, Response } from 'express';
import { TemplateCategoryService } from './templateCategory.service';

export const getAllTemplateCategories = async (req: Request, res: Response) => {
  try {
    const categories = await TemplateCategoryService.getAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template categories' });
  }
};

export const getTemplateCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await TemplateCategoryService.getById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Template category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template category' });
  }
};

export const createTemplateCategory = async (req: Request, res: Response) => {
  try {
    const category = await TemplateCategoryService.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create template category' });
  }
};

export const updateTemplateCategory = async (req: Request, res: Response) => {
  try {
    const category = await TemplateCategoryService.update(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update template category' });
  }
};

export const deleteTemplateCategory = async (req: Request, res: Response) => {
  try {
    await TemplateCategoryService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete template category' });
  }
}; 