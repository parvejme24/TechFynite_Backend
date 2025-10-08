import { ITemplateCategoryService } from "./template-category.interface";
import { TemplateCategory, CreateTemplateCategoryInput, UpdateTemplateCategoryInput, PaginatedTemplateCategories, TemplateCategoryStats } from "./template-category.type";
export declare class TemplateCategoryService implements ITemplateCategoryService {
    createTemplateCategory(data: CreateTemplateCategoryInput): Promise<TemplateCategory>;
    getAllTemplateCategories(page?: number, limit?: number, search?: string, sortBy?: string, sortOrder?: string): Promise<PaginatedTemplateCategories>;
    getTemplateCategoryById(id: string): Promise<TemplateCategory | null>;
    updateTemplateCategory(id: string, data: UpdateTemplateCategoryInput): Promise<TemplateCategory | null>;
    deleteTemplateCategory(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getTemplateCategoryStats(): Promise<TemplateCategoryStats>;
    generateSlug(title: string): string;
    isSlugUnique(slug: string, excludeId?: string): Promise<boolean>;
}
//# sourceMappingURL=template-category.service.d.ts.map