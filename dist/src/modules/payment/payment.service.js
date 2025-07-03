"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    createFastSpringSession: (data) => __awaiter(void 0, void 0, void 0, function* () {
        // Prepare FastSpring session payload as needed
        const response = yield axios_1.default.post(`${FASTSPRING_BASE}/sessions`, data, {
            auth: {
                username: FASTSPRING_USERNAME,
                password: FASTSPRING_PASSWORD,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }),
    handleFastSpringWebhook: (webhookData) => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Validate webhook (optional)
        // 2. Check payment status
        if (webhookData.event === 'order.completed') {
            // 3. Create order in DB
            yield order_service_1.OrderService.createFromPayment(webhookData);
            // 4. Send email (placeholder)
            // await sendEmail(...)
            // 5. Send notification (placeholder)
            // await NotificationService.create(...)
        }
    }),
};
