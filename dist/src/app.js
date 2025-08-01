"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const auth_1 = require("./modules/auth");
const user_1 = require("./modules/user");
const templateCategory_1 = require("./modules/templateCategory");
const template_1 = require("./modules/template");
const blogCategory_1 = require("./modules/blogCategory");
const blog_1 = require("./modules/blog");
const order_1 = require("./modules/order");
const blogReview_1 = require("./modules/blogReview");
const payment_1 = require("./modules/payment");
const notification_1 = require("./modules/notification");
const contact_1 = require("./modules/contact");
const newsletter_1 = require("./modules/newsletter");
const pricing_1 = require("./modules/pricing");
const checkout_1 = require("./modules/checkout");
const webhook_1 = require("./modules/webhook");
const license_1 = require("./modules/license");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Serve uploads directory statically
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://tf-f-ts.vercel.app",
        "https://tf-b-ts.vercel.app",
        "https://techfynite-backend.vercel.app"
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
// rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
// });
// app.use(limiter);
// home route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to TechFynite Server",
        status: "success",
        timestamp: new Date().toISOString(),
    });
});
// health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is healthy" });
});
app.use("/api/v1", auth_1.authRoutes);
app.use("/api/v1", user_1.userRoutes);
app.use("/api/v1", templateCategory_1.templateCategoryRoutes);
app.use("/api/v1", template_1.templateRoutes);
app.use("/api/v1", blogCategory_1.blogCategoryRoutes);
app.use("/api/v1", blog_1.blogRoutes);
app.use("/api/v1", blogReview_1.blogReviewRoutes);
app.use("/api/v1", order_1.orderRoutes);
app.use("/api/v1", payment_1.paymentRoutes);
app.use("/api/v1", notification_1.notificationRoutes);
app.use("/api/v1", contact_1.contactRoutes);
app.use("/api/v1", newsletter_1.newsletterRoutes);
app.use("/api/v1", pricing_1.pricingRoutes);
app.use("/api/v1", checkout_1.checkoutRoutes);
app.use("/api/v1", webhook_1.lemonsqueezyWebhookRoutes);
app.use("/api/v1", license_1.licenseRoutes);
// error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', err);
    console.error('Error stack:', err.stack);
    // Handle multer errors specifically
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            status: "error",
            message: "File too large. Please upload a smaller file.",
        });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
            status: "error",
            message: "Too many files uploaded. Please reduce the number of files.",
        });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            status: "error",
            message: "Unexpected file field. Please check your form data.",
        });
    }
    // Handle multer parsing errors
    if (err.message && err.message.includes('Unexpected end of form')) {
        return res.status(400).json({
            status: "error",
            message: "Invalid form data. Please check your request format.",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
    // If it's a known error with a specific message, use that
    if (err.message && err.message !== 'Something went wrong!') {
        return res.status(err.status || 500).json({
            status: "error",
            message: err.message,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
    // For database errors, provide more specific information
    if (err.code) {
        return res.status(500).json({
            status: "error",
            message: `Database error: ${err.code}`,
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
    // Generic error fallback
    res.status(500).json({
        status: "error",
        message: "Something went wrong!",
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
exports.default = app;
