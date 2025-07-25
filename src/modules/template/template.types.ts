export interface CreateTemplateRequest {
  title: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  version: number;
  publishedDate: string;
  downloads?: number;
  pages?: number;
  views?: number;
  totalPurchase?: number;
  previewLink?: string;
  shortDescription: string;
  description: string[];
  whatsIncluded: string[];
  keyFeatures: any[];
  screenshots: string[];
}

export interface UpdateTemplateRequest {
  title?: string;
  price?: number;
  imageUrl?: string;
  categoryId?: string;
  version?: number;
  publishedDate?: string;
  downloads?: number;
  pages?: number;
  views?: number;
  totalPurchase?: number;
  previewLink?: string;
  shortDescription?: string;
  description?: string[];
  whatsIncluded?: string[];
  keyFeatures?: any[];
  screenshots?: string[];
}
