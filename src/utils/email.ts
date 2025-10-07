import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } from "../config/secret";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  secure: false,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const subject = "Your OTP Code";
  const text = `Your OTP code is ${otp}. It will expire in 10 minutes.`;
  const html = `<p>Your OTP code is <b>${otp}</b>. It will expire in 10 minutes.</p>`;

  await transporter.sendMail({
    from: EMAIL_FROM || SMTP_USER,
    to,
    subject,
    text,
    html,
  });
}

