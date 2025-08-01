"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = exports.sendEmail = exports.generateOtp = exports.verifyRefreshToken = exports.signRefreshToken = exports.verifyJwt = exports.signJwt = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const crypto = __importStar(require("crypto"));
const nodemailer = __importStar(require("nodemailer"));
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = process.env.EXPIRES_IN || "15m";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your_refresh_secret";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
const signJwt = (payload, expiresIn = JWT_EXPIRES_IN) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn });
};
exports.signJwt = signJwt;
const verifyJwt = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
};
exports.verifyJwt = verifyJwt;
const signRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
};
exports.signRefreshToken = signRefreshToken;
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    }
    catch {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
};
exports.generateOtp = generateOtp;
const sendEmail = async (to, subject, text, html) => {
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
exports.sendEmail = sendEmail;
const sendOtpEmail = async (to, otp) => {
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
    await (0, exports.sendEmail)(to, subject, text, html);
};
exports.sendOtpEmail = sendOtpEmail;
