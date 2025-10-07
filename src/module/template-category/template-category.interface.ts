import { 
  TemplateCategory, 
  CreateTemplateCategoryInput, 
  UpdateTemplateCategoryInput, 
  PaginatedTemplateCategories,
  TemplateCategoryStats 
} from "./template-category.type";

export interface ITemplateCategoryService {
  // CRUD operations
  createTemplateCategory(data: CreateTemplateCategoryInput): Promise<TemplateCategory>;
  getAllTemplateCategories(
    page?: number,
    limit?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: string
  ): Promise<PaginatedTemplateCategories>;
  getTemplateCategoryById(id: string): Promise<TemplateCategory | null>;
  updateTemplateCategory(id: string, data: UpdateTemplateCategoryInput): Promise<TemplateCategory | null>;
  deleteTemplateCategory(id: string): Promise<{ success: boolean; message: string }>;
  
  // Statistics
  getTemplateCategoryStats(): Promise<TemplateCategoryStats>;
  
  // Utility methods
  generateSlug(title: string): string;
  isSlugUnique(slug: string, excludeId?: string): Promise<boolean>;
}
