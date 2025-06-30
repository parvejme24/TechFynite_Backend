import { OrderModel } from './order.model';
import { NotificationModel } from '../notification/notification.model';
import { CreateOrderRequest, UpdateOrderRequest } from './order.types';
import { sendEmail } from '../auth/auth.utils';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const OrderService = {
  create: async (data: CreateOrderRequest) => {
    // Create order
    const order = await OrderModel.create({
      ...data,
      orderId: crypto.randomUUID(),
      invoiceNumber: 'INV-' + Date.now(),
      invoiceDate: new Date(),
      paymentStatus: 'PENDING',
      status: 'PENDING',
      isDelivered: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // Send notification
    await NotificationModel.create({
      userId: data.userId,
      type: 'PAYMENT_CONFIRMED',
      message: `Order placed for template: ${data.templateName}`,
    });
    // Send invoice email
    await sendEmail(
      data.userEmail,
      'Order Invoice',
      `Thank you for your order!\nOrder ID: ${order.orderId}\nTemplate: ${data.templateName}\nTotal: $${data.totalPrice}`
    );
    return order;
  },
  update: async (id: string, data: UpdateOrderRequest) => {
    const order = await OrderModel.update(id, { ...data, updatedAt: new Date() });
    // Send notifications based on status
    if (data.status === 'CANCELLED') {
      await NotificationModel.create({
        userId: order.userId,
        type: 'ACCOUNT_UPDATE',
        message: `Order cancelled for template: ${order.templateName}`,
      });
    }
    if (data.status === 'DELIVERED') {
      await NotificationModel.create({
        userId: order.userId,
        type: 'TEMPLATE_DELIVERED',
        message: `Order delivered for template: ${order.templateName}`,
      });
      // Send download link via email if delivery method is DOWNLOAD
      if (order.deliveryMethod === 'DOWNLOAD' && order.deliveryUrl) {
        await sendEmail(
          order.userEmail,
          'Your Template Download',
          `Your template is ready! Download here: ${order.deliveryUrl}`
        );
      }
    }
    return order;
  },
  getById: (id: string) => OrderModel.findById(id),
  getAll: () => OrderModel.findAll(),
  delete: (id: string) => OrderModel.delete(id),
}; 