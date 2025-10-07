// Database configuration
export const DATABASE_URL: string = process.env.DATABASE_URL || "";

// General configuration
export const BCRYPT_ROUNDS: number = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
export const FRONTEND_URL: string = process.env.FRONTEND_URL || "";
export const PORT: number = parseInt(process.env.SERVER_RUNNING_PORT || "3030", 10);

// SMTP configuration
export const SMTP_HOST: string = process.env.SMTP_HOST || "";
export const SMTP_PORT: string = process.env.SMTP_PORT || "";
export const SMTP_USER: string = process.env.SMTP_USER || "";
export const SMTP_PASS: string = process.env.SMTP_PASS || "";
export const EMAIL_FROM: string = process.env.EMAIL_FROM || "";

// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || "";
export const CLOUDINARY_URL: string = process.env.CLOUDINARY_URL || "";
