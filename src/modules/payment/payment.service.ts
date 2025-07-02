import axios from 'axios';
import { OrderService } from '../order/order.service';
// import { NotificationService } from '../notification/notification.service';
// import { sendEmail } from '../notification/email.utils';

const FASTSPRING_BASE = process.env.FASTSPRING_BASE!;
const FASTSPRING_USERNAME = process.env.FASTSPRING_USERNAME!;
const FASTSPRING_PASSWORD = process.env.FASTSPRING_PASSWORD!;

export const PaymentService = {
  createFastSpringSession: async (data: any) => {
    // Prepare FastSpring session payload as needed
    const response = await axios.post(
      `${FASTSPRING_BASE}/sessions`,
      data,
      {
        auth: {
          username: FASTSPRING_USERNAME,
          password: FASTSPRING_PASSWORD,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },
  handleFastSpringWebhook: async (webhookData: any) => {
    // 1. Validate webhook (optional)
    // 2. Check payment status
    if (webhookData.event === 'order.completed') {
      // 3. Create order in DB
      await OrderService.createFromPayment(webhookData);
      // 4. Send email (placeholder)
      // await sendEmail(...)
      // 5. Send notification (placeholder)
      // await NotificationService.create(...)
    }
  },
}; 