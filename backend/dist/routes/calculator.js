"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calculatorController_1 = require("@/controllers/calculatorController");
const auth_1 = require("@/middleware/auth");
const router = (0, express_1.Router)();
// Public routes (with optional auth for tracking)
router.post('/calculate', auth_1.optionalAuth, calculatorController_1.validateCalculation, calculatorController_1.calculateSolarSystem);
router.get('/devices', calculatorController_1.getDeviceCatalog);
router.get('/sunlight', calculatorController_1.getLocationSunlightData);
exports.default = router;
//# sourceMappingURL=calculator.js.map