export interface CreateTemplateCategoryRequest {
  title: string;
  imageUrl?: string;
  slug: string;
}

export interface UpdateTemplateCategoryRequest {
  title?: string;
  imageUrl?: string;
  slug?: string;
} 