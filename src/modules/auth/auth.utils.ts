import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import { JwtPayload } from "./auth.types";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = process.env.EXPIRES_IN || "15m";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your_refresh_secret";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export const signJwt = (
  payload: JwtPayload,
  expiresIn: string = JWT_EXPIRES_IN
) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
};

export const verifyJwt = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

export const signRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN as any,
  });
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

export const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for port 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.SMTP_USER || "parvej@techfynite.com",
    to,
    subject,
    text,
    ...(html ? { html } : {}),
  });
};

export const sendOtpEmail = async (to: string, otp: string) => {
  const subject = "Verify your email address";
  const text = `Your verification code is: ${otp}`;
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset=\"UTF-8\" />
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        color: #1e0b9b;
      }
      .otp-box {
        background-color: #f0f4ff;
        color: #1e0b9b;
        font-size: 24px;
        font-weight: bold;
        padding: 15px;
        text-align: center;
        letter-spacing: 5px;
        border-radius: 8px;
        margin: 20px auto;
        width: fit-content;
      }
      .footer {
        text-align: center;
        font-size: 13px;
        color: #777;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class=\"container\">
      <h2 class=\"header\">Verify Your Email Address</h2>
      <p>Hello,</p>
      <p>To complete your registration with <strong>TechFynite</strong>, please use the following OTP to verify your email address:</p>

      <div class=\"otp-box\">${otp}</div>

      <p>This OTP is valid for the next 10 minutes. Do not share it with anyone.</p>

      <p>If you did not request this, please ignore this email.</p>

      <p>Thank you,<br />The TechFynite Team</p>

      <div class=\"footer\">
        &copy; 2025 TechFynite. All rights reserved.
      </div>
    </div>
  </body>
</html>`;
  await sendEmail(to, subject, text, html);
};
