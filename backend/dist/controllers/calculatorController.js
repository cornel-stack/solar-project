"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationSunlightData = exports.getDeviceCatalog = exports.calculateSolarSystem = exports.validateCalculation = void 0;
const solarCalculationService_1 = require("@/services/solarCalculationService");
const response_1 = require("@/utils/response");
const logger_1 = __importDefault(require("@/utils/logger"));
const express_validator_1 = require("express-validator");
const calculationService = new solarCalculationService_1.SolarCalculationService();
exports.validateCalculation = [
    (0, express_validator_1.body)('category').isIn(['HOME', 'BUSINESS', 'FARM']).withMessage('Category must be HOME, BUSINESS, or FARM'),
    (0, express_validator_1.body)('location').trim().notEmpty().withMessage('Location is required'),
    (0, express_validator_1.body)('sunlightHours').isFloat({ min: 1, max: 12 }).withMessage('Sunlight hours must be between 1 and 12'),
    (0, express_validator_1.body)('devices').isArray({ min: 1 }).withMessage('At least one device is required'),
    (0, express_validator_1.body)('devices.*.type').trim().notEmpty().withMessage('Device type is required'),
    (0, express_validator_1.body)('devices.*.quantity').isInt({ min: 1 }).withMessage('Device quantity must be at least 1'),
    (0, express_validator_1.body)('devices.*.hoursPerDay').isInt({ min: 1, max: 24 }).withMessage('Hours per day must be between 1 and 24'),
    (0, express_validator_1.body)('devices.*.powerConsumption').isInt({ min: 1 }).withMessage('Power consumption must be at least 1 watt'),
];
const calculateSolarSystem = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            (0, response_1.sendValidationError)(res, errors.array());
            return;
        }
        const calculatorData = req.body;
        // Additional validation using the service
        const validationErrors = calculationService.validateCalculationInput(calculatorData);
        if (validationErrors.length > 0) {
            (0, response_1.sendError)(res, 'Validation failed', 400, validationErrors);
            return;
        }
        const result = calculationService.calculateSolarSystem(calculatorData);
        (0, response_1.sendSuccess)(res, result, 'Solar system calculated successfully');
    }
    catch (error) {
        logger_1.default.error('Solar calculation error:', error);
        (0, response_1.sendError)(res, error.message || 'Calculation failed', 400);
    }
};
exports.calculateSolarSystem = calculateSolarSystem;
const getDeviceCatalog = async (req, res) => {
    try {
        const catalog = calculationService.getDeviceCatalog();
        (0, response_1.sendSuccess)(res, catalog, 'Device catalog retrieved successfully');
    }
    catch (error) {
        logger_1.default.error('Get device catalog error:', error);
        (0, response_1.sendError)(res, error.message || 'Failed to get device catalog', 500);
    }
};
exports.getDeviceCatalog = getDeviceCatalog;
const getLocationSunlightData = async (req, res) => {
    try {
        const { location } = req.query;
        if (!location || typeof location !== 'string') {
            (0, response_1.sendError)(res, 'Location parameter is required', 400);
            return;
        }
        // Mock sunlight data for African countries
        const sunlightData = {
            'Nigeria': 5.5,
            'Kenya': 6.2,
            'South Africa': 5.8,
            'Ghana': 5.4,
            'Tanzania': 6.0,
            'Uganda': 5.9,
            'Rwanda': 5.7,
            'Ethiopia': 6.1,
            'Morocco': 5.9,
            'Egypt': 6.8,
            'Senegal': 5.6,
            'Mali': 6.3,
            'Burkina Faso': 6.0,
            'Ivory Coast': 5.3,
        };
        const averageSunlight = sunlightData[location] || 5.5; // Default fallback
        (0, response_1.sendSuccess)(res, {
            location,
            averageSunlightHours: averageSunlight,
            unit: 'hours/day'
        }, 'Sunlight data retrieved successfully');
    }
    catch (error) {
        logger_1.default.error('Get sunlight data error:', error);
        (0, response_1.sendError)(res, error.message || 'Failed to get sunlight data', 500);
    }
};
exports.getLocationSunlightData = getLocationSunlightData;
//# sourceMappingURL=calculatorController.js.map