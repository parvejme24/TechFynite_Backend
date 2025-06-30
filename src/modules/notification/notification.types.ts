export interface CreateNotificationRequest {
  userId: string;
  type: 'PAYMENT_CONFIRMED' | 'TEMPLATE_DELIVERED' | 'BLOG_COMMENT' | 'ACCOUNT_UPDATE';
  message: string;
}

export interface UpdateNotificationRequest {
  isRead?: boolean;
} 