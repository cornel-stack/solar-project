"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const calculator_1 = __importDefault(require("./calculator"));
const plans_1 = __importDefault(require("./plans"));
const router = (0, express_1.Router)();
// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'SolarAfrica API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});
// API routes
router.use('/auth', auth_1.default);
router.use('/calculator', calculator_1.default);
router.use('/plans', plans_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map