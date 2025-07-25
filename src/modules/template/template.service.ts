import { TemplateModel } from './template.model';
import { CreateTemplateRequest, UpdateTemplateRequest } from './template.types';

export const TemplateService = {
  getAll: () => TemplateModel.getAll(),
  getById: (id: string) => TemplateModel.getById(id),
  create: (data: CreateTemplateRequest) => TemplateModel.create(data),
  update: (id: string, data: UpdateTemplateRequest) => TemplateModel.update(id, data),
  delete: (id: string) => TemplateModel.delete(id),
};
