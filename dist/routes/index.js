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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("../module/auth/auth.route"));
const newsletter_route_1 = __importDefault(require("../module/newsletter/newsletter.route"));
const contact_route_1 = __importDefault(require("../module/contact/contact.route"));
const blog_category_route_1 = __importDefault(require("../module/blog-category/blog-category.route"));
const blog_route_1 = __importDefault(require("../module/blog/blog.route"));
const blog_review_route_1 = __importDefault(require("../module/blog-review/blog-review.route"));
const template_category_route_1 = __importDefault(require("../module/template-category/template-category.route"));
const template_route_1 = __importDefault(require("../module/template/template.route"));
const order_route_1 = __importDefault(require("../module/order/order.route"));
const license_route_1 = __importDefault(require("../module/license/license.route"));
const webhook_route_1 = __importDefault(require("../module/webhook/webhook.route"));
const cloudinary_upload_1 = require("../middleware/cloudinary-upload");
const router = (0, express_1.Router)();
router.use("/api/v1", auth_route_1.default);
router.use("/api/v1", newsletter_route_1.default);
router.use("/api/v1", contact_route_1.default);
router.use("/api/v1", blog_category_route_1.default);
router.use("/api/v1", blog_route_1.default);
router.use("/api/v1", blog_review_route_1.default);
router.use("/api/v1", template_category_route_1.default);
router.use("/api/v1", template_route_1.default);
router.use("/api/v1", order_route_1.default);
router.use("/api/v1", license_route_1.default);
router.use("/api/v1", webhook_route_1.default);
router.get("/api/v1/health/cloudinary", async (req, res) => {
    const result = await (0, cloudinary_upload_1.cloudinaryHealthCheck)();
    if (result.ok)
        return res.json({ success: true, message: "Cloudinary OK", info: result.message });
    return res.status(500).json({ success: false, message: "Cloudinary error", error: result.message });
});
router.get("/api/v1/debug/cloudinary", (req, res) => {
    (0, cloudinary_upload_1.debugCloudinaryConfig)();
    res.json({ success: true, message: "Debug info logged to console" });
});
router.post("/api/v1/test/cloudinary", async (req, res) => {
    try {
        const { uploadBufferToCloudinary } = await Promise.resolve().then(() => __importStar(require("../middleware/cloudinary-upload")));
        const testBuffer = Buffer.from("test image data");
        const testFile = {
            buffer: testBuffer,
            originalname: "test.jpg",
            mimetype: "image/jpeg"
        };
        const result = await uploadBufferToCloudinary(testFile, "test");
        res.json({ success: true, message: "Cloudinary test successful", data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Cloudinary test failed", error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map