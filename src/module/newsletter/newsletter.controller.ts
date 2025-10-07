import { Request, Response } from "express";
import { NewsletterService } from "./newsletter.service";
import { NewsletterStatsQuery } from "./newsletter.type";

const newsletterService = new NewsletterService();

// Subscribe to newsletter
export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const userId = (req as any).user?.id; // Get user ID if authenticated

    const subscriber = await newsletterService.subscribeNewsletter(email, userId);

    return res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter",
      data: subscriber,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to subscribe to newsletter",
    });
  }
};

// Get all newsletter subscribers
export const getAllNewsletterSubscribers = async (
  req: Request,
  res: Response
) => {
  try {
    const subscribers = await newsletterService.getAllSubscribers();

    return res.status(200).json({
      success: true,
      message: "Newsletter subscribers fetched successfully",
      data: subscribers,
      count: subscribers.length,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch newsletter subscribers",
    });
  }
};

// Delete newsletter subscriber
export const deleteNewsletterSubscriber = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await newsletterService.deleteSubscriber(id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete newsletter subscriber",
    });
  }
};

// Get newsletter statistics
export const newsletterStats = async (req: Request, res: Response) => {
  try {
    const { period, startDate, endDate } = req.query as NewsletterStatsQuery;

    const stats = await newsletterService.getNewsletterStats(
      period,
      startDate,
      endDate
    );

    return res.status(200).json({
      success: true,
      message: "Newsletter statistics fetched successfully",
      data: stats,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch newsletter statistics",
    });
  }
};
