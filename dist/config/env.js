"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: zod_1.z.string().transform(Number).default(3000),
    BCRYPT_ROUNDS: zod_1.z.string().transform(Number).default(12),
    FRONTEND_URL: zod_1.z.string().url().default("http://localhost:3000"),
    DATABASE_URL: zod_1.z.string().min(1, "DATABASE_URL is required"),
    SMTP_HOST: zod_1.z.string().default("smtp.gmail.com"),
    SMTP_PORT: zod_1.z.string().default("587"),
    SMTP_USER: zod_1.z.string().default("adnanparvej775@gmail.com"),
    SMTP_PASS: zod_1.z.string().default("zndqbefivydidolg"),
    EMAIL_FROM: zod_1.z.string().default("adnanparvej775@gmail.com"),
    CLOUD_NAME: zod_1.z.string().default("tf-assets"),
    API_KEY: zod_1.z.string().default("565991621486232"),
    API_SECRET: zod_1.z.string().default("5vXkbc-38vVUetXybyM-TbbFgvo"),
});
const validateEnv = () => {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const missingVars = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
            throw new Error(`Environment validation failed:\n${missingVars.join("\n")}`);
        }
        throw error;
    }
};
exports.env = validateEnv();
//# sourceMappingURL=env.js.map