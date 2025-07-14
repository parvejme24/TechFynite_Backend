"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const dotenv_1 = require("dotenv");
const database_1 = require("../src/config/database");
const app_1 = __importDefault(require("../src/app"));
(0, dotenv_1.config)();
let serverInitialized = false;
async function handler(req, res) {
    if (!serverInitialized) {
        await (0, database_1.connectDB)();
        serverInitialized = true;
    }
    (0, app_1.default)(req, res);
}
