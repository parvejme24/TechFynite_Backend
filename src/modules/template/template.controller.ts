import { Request, Response } from 'express';
import { TemplateService } from './template.service';
import { CreateTemplateRequest, UpdateTemplateRequest } from './template.types';

function parseArrayField(field: any): any[] {
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
      return [field];
    } catch {
      return [field];
    }
  }
  if (field == null) return [];
  return [String(field)];
}

function getUploadedScreenshots(files: any): string[] {
  if (!files || !files.screenshots) return [];
  return files.screenshots.map((file: any) => `/uploads/templateScreenshots/${file.filename}`);
}

function getUploadedImage(files: any, fieldName: string): string | undefined {
  if (!files || !files[fieldName]) return undefined;
  return `/uploads/templateImage/${files[fieldName][0].filename}`;
}

function getUploadedFile(files: any, fieldName: string): string | undefined {
  if (!files || !files[fieldName]) return undefined;
  return `/uploads/templateFile/${files[fieldName][0].filename}`;
}

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
    const imageUrl = getUploadedImage(req.files, 'image');
    const fileUrl = getUploadedFile(req.files, 'templateFile');
    const screenshots = getUploadedScreenshots(req.files);
    
    const {
      title, price, categoryId, version, publishedDate, downloads, pages, views, totalPurchase, previewLink, shortDescription, description, whatsIncluded, keyFeatures
    } = req.body;
    
    const template = await TemplateService.create({
      title,
      price: Number(price),
      imageUrl,
      fileUrl,
      categoryId,
      version: Number(version),
      publishedDate,
      downloads: downloads ? Number(downloads) : undefined,
      pages: pages ? Number(pages) : undefined,
      views: views ? Number(views) : undefined,
      totalPurchase: totalPurchase ? Number(totalPurchase) : undefined,
      previewLink,
      shortDescription,
      description: parseArrayField(description),
      whatsIncluded: parseArrayField(whatsIncluded),
      keyFeatures: parseArrayField(keyFeatures),
      screenshots,
    } as CreateTemplateRequest);
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create template', details: error instanceof Error ? error.message : error });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const imageUrl = getUploadedImage(req.files, 'image') || req.body.imageUrl;
    const fileUrl = getUploadedFile(req.files, 'templateFile') || req.body.fileUrl;
    let screenshots = getUploadedScreenshots(req.files);
    
    // If no new screenshots uploaded, use the ones from the body (if any)
    if (!screenshots.length && req.body.screenshots) {
      screenshots = parseArrayField(req.body.screenshots);
    }
    
    const {
      title, price, categoryId, version, publishedDate, downloads, pages, views, totalPurchase, previewLink, shortDescription, description, whatsIncluded, keyFeatures
    } = req.body;
    
    const template = await TemplateService.update(req.params.id, {
      ...(title !== undefined && { title }),
      ...(price !== undefined && { price: Number(price) }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(fileUrl !== undefined && { fileUrl }),
      ...(categoryId !== undefined && { categoryId }),
      ...(version !== undefined && { version: Number(version) }),
      ...(publishedDate !== undefined && { publishedDate }),
      ...(downloads !== undefined && { downloads: Number(downloads) }),
      ...(pages !== undefined && { pages: Number(pages) }),
      ...(views !== undefined && { views: Number(views) }),
      ...(totalPurchase !== undefined && { totalPurchase: Number(totalPurchase) }),
      ...(previewLink !== undefined && { previewLink }),
      ...(shortDescription !== undefined && { shortDescription }),
      ...(description !== undefined && { description: parseArrayField(description) }),
      ...(whatsIncluded !== undefined && { whatsIncluded: parseArrayField(whatsIncluded) }),
      ...(keyFeatures !== undefined && { keyFeatures: parseArrayField(keyFeatures) }),
      ...(screenshots !== undefined && { screenshots }),
    } as UpdateTemplateRequest);
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update template', details: error instanceof Error ? error.message : error });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    await TemplateService.delete(req.params.id);
    res.status(204).send({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete template' });
  }
};
