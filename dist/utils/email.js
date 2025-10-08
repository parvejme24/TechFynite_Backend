"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = sendOtpEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const secret_1 = require("../config/secret");
const transporter = nodemailer_1.default.createTransport({
    host: secret_1.SMTP_HOST,
    port: Number(secret_1.SMTP_PORT) || 587,
    secure: false,
    auth: secret_1.SMTP_USER && secret_1.SMTP_PASS ? { user: secret_1.SMTP_USER, pass: secret_1.SMTP_PASS } : undefined,
});
async function sendOtpEmail(to, otp) {
    const subject = "Your OTP Code";
    const text = `Your OTP code is ${otp}. It will expire in 10 minutes.`;
    const html = `<p>Your OTP code is <b>${otp}</b>. It will expire in 10 minutes.</p>`;
    await transporter.sendMail({
        from: secret_1.EMAIL_FROM || secret_1.SMTP_USER,
        to,
        subject,
        text,
        html,
    });
}
//# sourceMappingURL=email.js.map