import { config } from "dotenv";
import { connectDB } from "../src/config/database";
import app from "../src/app";

// Load environment variables
config();

let serverInitialized = false;

export default async function handler(req: any, res: any) {
  if (!serverInitialized) {
    try {
      await connectDB();
      serverInitialized = true;
    } catch (error) {
      console.error('Failed to connect to database:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  
  // Handle the request with the Express app
  return app(req, res);
}
