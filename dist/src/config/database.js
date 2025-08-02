"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.prisma = void 0;
const prisma_1 = require("../generated/prisma");
// Create Prisma client with connection pooling for Vercel
const prisma = globalThis.__prisma || new prisma_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
exports.prisma = prisma;
// In development, store the instance globally to prevent multiple instances
if (process.env.NODE_ENV === 'development') {
    globalThis.__prisma = prisma;
}
const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Database connection established successfully');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        // Don't exit process in serverless environment
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        throw error;
    }
};
exports.connectDB = connectDB;
