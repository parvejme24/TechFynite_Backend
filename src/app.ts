import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { xss } from "express-xss-sanitizer";
import morgan from "morgan";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Logging middleware
app.use(morgan("dev"));

// Custom request logging
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Security middleware
app.use(helmet());
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Import routes
import routes from "./routes";

// Use routes
app.use(routes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "TechFynite Backend Server",
    version: "1.0.0",
    status: "running",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err.stack);
    res.status(500).json({
      error: "Internal Server Error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong!",
      timestamp: new Date().toISOString(),
    });
  }
);

export default app;
