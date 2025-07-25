export interface CreateBlogCategoryRequest {
  title: string;
  imageUrl?: string; // Can be base64 string (for upload) or path (for stored)
  slug: string;
}

export interface UpdateBlogCategoryRequest {
  title?: string;
  imageUrl?: string; // Can be base64 string (for upload) or path (for stored)
  slug?: string;
}
