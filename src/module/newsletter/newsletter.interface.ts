import { NewsletterSubscriber, NewsletterStats } from "./newsletter.type";

export interface INewsletterService {
  subscribeNewsletter(email: string, userId?: string): Promise<NewsletterSubscriber>;
  getAllSubscribers(): Promise<NewsletterSubscriber[]>;
  deleteSubscriber(id: string): Promise<{ success: boolean; message: string }>;
  getNewsletterStats(
    period?: string,
    startDate?: string,
    endDate?: string
  ): Promise<NewsletterStats>;
}
