import { TemplateModel } from './template.model';
import { CreateTemplateRequest, UpdateTemplateRequest } from './template.types';

export const TemplateService = {
  getAll: () => TemplateModel.getAll(),
  getById: (id: string) => TemplateModel.getById(id),
  getBySlug: (slug: string) => TemplateModel.getBySlug(slug),
  getByCategory: (categoryId: string) => TemplateModel.getByCategory(categoryId),
  create: (data: CreateTemplateRequest) => TemplateModel.create(data),
  update: (id: string, data: UpdateTemplateRequest) => TemplateModel.update(id, data),
  delete: (id: string) => TemplateModel.delete(id),
};
