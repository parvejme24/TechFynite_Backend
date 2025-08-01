import { prisma } from '../../config/database';
import crypto from 'crypto';

const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

export const LemonSqueezyWebhookService = {
  verifySignature: (body: any, signature: string): boolean => {
    if (!LEMONSQUEEZY_WEBHOOK_SECRET) {
      console.warn('LEMONSQUEEZY_WEBHOOK_SECRET not configured');
      return true; // Allow in development
    }

    const hmac = crypto.createHmac('sha256', LEMONSQUEEZY_WEBHOOK_SECRET);
    const digest = hmac.update(JSON.stringify(body)).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  },

  processWebhook: async (body: any) => {
    const { event_name, data } = body;

    // Only process order_created events
    if (event_name !== 'order_created') {
      throw new Error(`Unsupported event: ${event_name}`);
    }

    const order = data;
    const orderId = order.id;
    const customerEmail = order.attributes.customer_email;
    const customerName = order.attributes.customer_name;
    const total = order.attributes.total;
    const status = order.attributes.status;

    // Get template details from custom data
    const customData = order.attributes.custom_data;
    const templateId = customData.template_id;
    const templateSlug = customData.template_slug;

    if (!templateId) {
      throw new Error('Template ID not found in order data');
    }

    // Get template
    const template = await prisma.template.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      throw new Error('Template not found');
    }

    // Find or create user by email
    let user = await prisma.user.findUnique({
      where: { email: customerEmail }
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: customerEmail,
          displayName: customerName || customerEmail.split('@')[0],
          password: crypto.randomBytes(32).toString('hex'), // Temporary password
          role: 'USER',
        }
      });
    }

    // Create order invoice
    const orderInvoice = await prisma.orderInvoice.create({
      data: {
        orderId: orderId.toString(),
        userId: user.id,
        templateId: template.id,
        templateName: template.title,
        templateThumbnail: template.imageUrl || '',
        templatePrice: template.price,
        totalPrice: total / 100, // Convert from cents
        paymentMethod: 'CREDIT_CARD', // Default
        paymentStatus: status === 'paid' ? 'COMPLETED' : 'PENDING',
        status: status === 'paid' ? 'CONFIRMED' : 'PENDING',
        deliveryMethod: 'DOWNLOAD',
        deliveryUrl: template.sourceFiles[0] || '', // First source file
        invoiceNumber: `INV-${Date.now()}`,
        invoiceDate: new Date(),
        userEmail: customerEmail,
      }
    });

    // If payment is completed, create license
    if (status === 'paid') {
      // Get license from LemonSqueezy
      const licenseKey = await LemonSqueezyWebhookService.getLicenseFromLemonSqueezy(orderId);

      if (licenseKey) {
        await prisma.license.create({
          data: {
            licenseKey,
            templateId: template.id,
            userId: user.id,
            orderId: orderId.toString(),
            isValid: true,
          }
        });
      }

      // Update template purchase count
      await prisma.template.update({
        where: { id: template.id },
        data: {
          totalPurchase: {
            increment: 1
          }
        }
      });
    }

    return {
      orderId: orderId.toString(),
      userId: user.id,
      templateId: template.id,
      status
    };
  },

  getLicenseFromLemonSqueezy: async (orderId: string): Promise<string | null> => {
    try {
      const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
      
      const response = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEMONSQUEEZY_API_KEY}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch order from LemonSqueezy');
        return null;
      }

      const orderData = await response.json();
      const licenseKey = orderData.data.attributes.license_key;

      return licenseKey || null;
    } catch (error) {
      console.error('Error fetching license from LemonSqueezy:', error);
      return null;
    }
  },
}; 