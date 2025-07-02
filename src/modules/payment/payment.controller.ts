import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

export const checkout = async (req: Request, res: Response) => {
  try {
    const session = (await PaymentService.createFastSpringSession(
      req.body
    )) as { url: string };
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};

export const fastspringWebhook = async (req: Request, res: Response) => {
  try {
    await PaymentService.handleFastSpringWebhook(req.body);
    res.status(200).send("OK");
  } catch (error) {
    res.status(500).json({ error: "Webhook processing failed" });
  }
};
