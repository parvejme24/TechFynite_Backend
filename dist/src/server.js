"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = require("dotenv");
const database_1 = require("./config/database");
// load environment variables
(0, dotenv_1.config)();
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        // Connect to database
        await (0, database_1.connectDB)();
        // Start the server
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log('Press CTRL+C to stop the server');
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
