"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.licenseRoutes = exports.LicenseService = exports.validateLicense = void 0;
var license_controller_1 = require("./license.controller");
Object.defineProperty(exports, "validateLicense", { enumerable: true, get: function () { return license_controller_1.validateLicense; } });
var license_service_1 = require("./license.service");
Object.defineProperty(exports, "LicenseService", { enumerable: true, get: function () { return license_service_1.LicenseService; } });
var license_routes_1 = require("./license.routes");
Object.defineProperty(exports, "licenseRoutes", { enumerable: true, get: function () { return __importDefault(license_routes_1).default; } });
