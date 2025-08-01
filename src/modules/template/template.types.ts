export interface CreateTemplateRequest {
  title: string;
  price: number;
  imageUrl?: string;
  sourceFiles?: string[]; // Array of downloadable file URLs
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
  lemonsqueezyProductId?: string;
  lemonsqueezyVariantId?: string;
  lemonsqueezyPermalink?: string;
}

export interface UpdateTemplateRequest {
  title?: string;
  price?: number;
  imageUrl?: string;
  sourceFiles?: string[]; // Array of downloadable file URLs
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
  lemonsqueezyProductId?: string;
  lemonsqueezyVariantId?: string;
  lemonsqueezyPermalink?: string;
}
