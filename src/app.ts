import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { authRoutes } from "./modules/auth";
import { userRoutes } from "./modules/user";
import { templateCategoryRoutes } from "./modules/templateCategory";
import { templateRoutes } from "./modules/template";
import { blogCategoryRoutes } from "./modules/blogCategory";
import { blogRoutes } from "./modules/blog";
import { notificationRoutes } from "./modules/notification";
import { orderRoutes } from "./modules/order";

const app: Application = express();

// security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each ip to 100 requests per windowms
});
app.use(limiter);

// home route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to TechFynite Server",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

// health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", templateCategoryRoutes);
app.use("/api/v1", templateRoutes);
app.use("/api/v1", blogCategoryRoutes);
app.use("/api/v1", blogRoutes);
app.use("/api/v1", notificationRoutes);
app.use("/api/v1", orderRoutes);

// error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

export default app;
