"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const dotenv_1 = require("dotenv");
const database_1 = require("../src/config/database");
const app_1 = __importDefault(require("../src/app"));
// Load environment variables
(0, dotenv_1.config)();
let serverInitialized = false;
async function handler(req, res) {
    if (!serverInitialized) {
        try {
            await (0, database_1.connectDB)();
            serverInitialized = true;
        }
        catch (error) {
            console.error('Failed to connect to database:', error);
            return res.status(500).json({ error: 'Database connection failed' });
        }
    }
    // Handle the request with the Express app
    return (0, app_1.default)(req, res);
}
