export interface CreateOrderRequest {
  userId: string;
  templateId: string;
  templateName: string;
  templateThumbnail?: string;
  templatePrice: number;
  totalPrice: number;
  paymentMethod: 'CREDIT_CARD' | 'PAYPAL' | 'STRIPE' | 'BANK_TRANSFER';
  deliveryMethod: 'DOWNLOAD' | 'EMAIL';
  userEmail: string;
}

export interface UpdateOrderRequest {
  paymentStatus?: 'PENDING' | 'COMPLETED' | 'FAILED';
  status?: 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
  isDelivered?: boolean;
  deliveryUrl?: string;
} 