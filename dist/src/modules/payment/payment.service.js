"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const axios_1 = __importDefault(require("axios"));
const order_service_1 = require("../order/order.service");
// import { NotificationService } from '../notification/notification.service';
// import { sendEmail } from '../notification/email.utils';
const FASTSPRING_BASE = process.env.FASTSPRING_BASE;
const FASTSPRING_USERNAME = process.env.FASTSPRING_USERNAME;
const FASTSPRING_PASSWORD = process.env.FASTSPRING_PASSWORD;
exports.PaymentService = {
    createFastSpringSession: async (data) => {
        // Prepare FastSpring session payload as needed
        const response = await axios_1.default.post(`${FASTSPRING_BASE}/sessions`, data, {
            auth: {
                username: FASTSPRING_USERNAME,
                password: FASTSPRING_PASSWORD,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    },
    handleFastSpringWebhook: async (webhookData) => {
        // 1. Validate webhook (optional)
        // 2. Check payment status
        if (webhookData.event === 'order.completed') {
            // 3. Create order in DB
            await order_service_1.OrderService.createFromPayment(webhookData);
            // 4. Send email (placeholder)
            // await sendEmail(...)
            // 5. Send notification (placeholder)
            // await NotificationService.create(...)
        }
    },
};
