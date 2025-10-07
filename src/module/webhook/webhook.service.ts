import { PrismaClient } from "@prisma/client";
import { LemonSqueezyWebhookPayload, WebhookProcessingResult } from "./webhook.type";
import crypto from "crypto";

const prisma = new PrismaClient();

export class WebhookService {
  private readonly LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.LEMONSQUEEZY_WEBHOOK_SECRET) {
      console.error("LEMONSQUEEZY_WEBHOOK_SECRET not configured");
      return false;
    }

    const expectedSignature = crypto
      .createHmac("sha256", this.LEMONSQUEEZY_WEBHOOK_SECRET)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  }

  // Process order created webhook
  async processOrderCreated(payload: LemonSqueezyWebhookPayload): Promise<WebhookProcessingResult> {
    try {
      const { data } = payload;
      const { attributes } = data;

      // Check if order already exists
      const existingOrder = await prisma.orderInvoice.findUnique({
        where: { lemonsqueezyOrderId: data.id },
      });

      if (existingOrder) {
        return {
          success: true,
          message: "Order already exists",
          orderId: existingOrder.id,
        };
      }

      // Find template by Lemon Squeezy product ID
      const template = await prisma.template.findFirst({
        where: {
          OR: [
            { lemonsqueezyProductId: attributes.first_order_item.product_id.toString() },
            { lemonsqueezyVariantId: attributes.first_order_item.variant_id.toString() },
          ],
        },
      });

      if (!template) {
        return {
          success: false,
          message: "Template not found for this product",
          error: `No template found for product ID: ${attributes.first_order_item.product_id}`,
        };
      }

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { email: attributes.user_email },
      });

      if (!user) {
        // Create user if doesn't exist
        user = await prisma.user.create({
          data: {
            fullName: attributes.user_name,
            email: attributes.user_email,
            role: "USER",
          },
        });
      }

      // Create order
      const order = await prisma.orderInvoice.create({
        data: {
          userId: user.id,
          templateId: template.id,
          lemonsqueezyOrderId: data.id,
          lemonsqueezyInvoiceId: data.id, // Using order ID as invoice ID
          status: this.mapLemonSqueezyStatus(attributes.status),
          totalAmount: attributes.total_usd,
          currency: "USD",
          licenseType: this.determineLicenseType(attributes.first_order_item.variant_name),
          paymentMethod: "Lemon Squeezy",
          customerEmail: attributes.user_email,
          customerName: attributes.user_name,
          billingAddress: {
            email: attributes.user_email,
            name: attributes.user_name,
          },
          downloadLinks: [], // Will be populated when licenses are created
        },
      });

      // Create license keys
      const licenseKeys = await this.generateLicenseKeys(template.id, user.id, order.id, data.id);
      
      // Update order with download links
      await prisma.orderInvoice.update({
        where: { id: order.id },
        data: {
          downloadLinks: licenseKeys.map(license => license.licenseKey),
        },
      });

      // Increment template purchase count
      await prisma.template.update({
        where: { id: template.id },
        data: { totalPurchase: { increment: 1 } },
      });

      return {
        success: true,
        message: "Order and licenses created successfully",
        orderId: order.id,
        licenseIds: licenseKeys.map(license => license.id),
      };
    } catch (error: any) {
      console.error("Error processing order created webhook:", error);
      return {
        success: false,
        message: "Failed to process order",
        error: error.message,
      };
    }
  }

  // Process order updated webhook
  async processOrderUpdated(payload: LemonSqueezyWebhookPayload): Promise<WebhookProcessingResult> {
    try {
      const { data } = payload;
      const { attributes } = data;

      // Find existing order
      const order = await prisma.orderInvoice.findUnique({
        where: { lemonsqueezyOrderId: data.id },
      });

      if (!order) {
        return {
          success: false,
          message: "Order not found",
          error: `Order with Lemon Squeezy ID ${data.id} not found`,
        };
      }

      // Update order status
      const updatedOrder = await prisma.orderInvoice.update({
        where: { id: order.id },
        data: {
          status: this.mapLemonSqueezyStatus(attributes.status),
        },
      });

      // If order is refunded, revoke licenses
      if (attributes.refunded) {
        await prisma.license.updateMany({
          where: { orderId: order.id },
          data: { isActive: false },
        });
      }

      return {
        success: true,
        message: "Order updated successfully",
        orderId: updatedOrder.id,
      };
    } catch (error: any) {
      console.error("Error processing order updated webhook:", error);
      return {
        success: false,
        message: "Failed to process order update",
        error: error.message,
      };
    }
  }

  // Map Lemon Squeezy status to our order status
  private mapLemonSqueezyStatus(lsStatus: string): "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "REFUNDED" {
    switch (lsStatus.toLowerCase()) {
      case "pending":
        return "PENDING";
      case "processing":
        return "PROCESSING";
      case "completed":
        return "COMPLETED";
      case "cancelled":
        return "CANCELLED";
      case "refunded":
        return "REFUNDED";
      default:
        return "PENDING";
    }
  }

  // Determine license type from variant name
  private determineLicenseType(variantName: string): "SINGLE" | "EXTENDED" {
    const lowerVariant = variantName.toLowerCase();
    if (lowerVariant.includes("extended") || lowerVariant.includes("commercial")) {
      return "EXTENDED";
    }
    return "SINGLE";
  }

  // Generate license keys
  private async generateLicenseKeys(templateId: string, userId: string, orderId: string, lemonsqueezyOrderId: string) {
    const licenses = [];
    const licenseCount = 1; // Default to 1 license per order

    for (let i = 0; i < licenseCount; i++) {
      const licenseKey = this.generateLicenseKey();
      
      const license = await prisma.license.create({
        data: {
          orderId,
          templateId,
          userId,
          licenseType: "SINGLE", // Will be updated based on variant
          licenseKey,
          lemonsqueezyOrderId,
          isActive: true,
          maxUsage: 1, // Single use by default
          usedCount: 0,
        },
      });

      licenses.push(license);
    }

    return licenses;
  }

  // Generate a unique license key
  private generateLicenseKey(): string {
    const prefix = "TF";
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}
