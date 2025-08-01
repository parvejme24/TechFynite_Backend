import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

export const checkout = async (req: Request, res: Response) => {
  try {
    // Redirect to new LemonSqueezy checkout system
    res.status(410).json({ 
      error: "FastSpring checkout is deprecated. Please use the new checkout system at /api/v1/checkout/:templateId",
      message: "Use POST /api/v1/checkout/:templateId with email and name in body"
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};

export const fastspringWebhook = async (req: Request, res: Response) => {
  try {
    // Redirect to new LemonSqueezy webhook system
    res.status(410).json({ 
      error: "FastSpring webhook is deprecated. Please use the new webhook system at /api/v1/webhook/lemonsqueezy",
      message: "LemonSqueezy webhooks are now handled at /api/v1/webhook/lemonsqueezy"
    });
  } catch (error) {
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

// New payment status endpoint
export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const status = await PaymentService.getPaymentStatus(orderId);
    
    if (!status) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Failed to get payment status" });
  }
};

// New user payment history endpoint
export const getUserPaymentHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const history = await PaymentService.getUserPaymentHistory(userId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to get payment history" });
  }
};
