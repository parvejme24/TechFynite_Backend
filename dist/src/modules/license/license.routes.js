"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const license_controller_1 = require("./license.controller");
const router = (0, express_1.Router)();
router.post('/licenses/validate', license_controller_1.validateLicense);
exports.default = router;
