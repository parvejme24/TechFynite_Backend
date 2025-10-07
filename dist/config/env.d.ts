import { z } from "zod";
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    PORT: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    BCRYPT_ROUNDS: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    FRONTEND_URL: z.ZodDefault<z.ZodString>;
    DATABASE_URL: z.ZodString;
    SMTP_HOST: z.ZodDefault<z.ZodString>;
    SMTP_PORT: z.ZodDefault<z.ZodString>;
    SMTP_USER: z.ZodDefault<z.ZodString>;
    SMTP_PASS: z.ZodDefault<z.ZodString>;
    EMAIL_FROM: z.ZodDefault<z.ZodString>;
    CLOUD_NAME: z.ZodDefault<z.ZodString>;
    API_KEY: z.ZodDefault<z.ZodString>;
    API_SECRET: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export declare const env: {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    BCRYPT_ROUNDS: number;
    FRONTEND_URL: string;
    DATABASE_URL: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASS: string;
    EMAIL_FROM: string;
    CLOUD_NAME: string;
    API_KEY: string;
    API_SECRET: string;
};
export type Env = z.infer<typeof envSchema>;
export {};
//# sourceMappingURL=env.d.ts.map