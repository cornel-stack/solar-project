"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedPlan = exports.sharePlan = exports.duplicatePlan = exports.deletePlan = exports.updatePlan = exports.getPlanById = exports.getUserPlans = exports.createPlan = exports.validatePagination = exports.validateUpdatePlan = exports.validateCreatePlan = void 0;
const planService_1 = require("@/services/planService");
const response_1 = require("@/utils/response");
const logger_1 = __importDefault(require("@/utils/logger"));
const express_validator_1 = require("express-validator");
const planService = new planService_1.PlanService();
exports.validateCreatePlan = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Plan name is required'),
    (0, express_validator_1.body)('category').isIn(['HOME', 'BUSINESS', 'FARM']).withMessage('Category must be HOME, BUSINESS, or FARM'),
    (0, express_validator_1.body)('location').trim().notEmpty().withMessage('Location is required'),
    (0, express_validator_1.body)('sunlightHours').isFloat({ min: 1, max: 12 }).withMessage('Sunlight hours must be between 1 and 12'),
    (0, express_validator_1.body)('devices').isArray({ min: 1 }).withMessage('At least one device is required'),
    (0, express_validator_1.body)('devices.*.type').trim().notEmpty().withMessage('Device type is required'),
    (0, express_validator_1.body)('devices.*.quantity').isInt({ min: 1 }).withMessage('Device quantity must be at least 1'),
    (0, express_validator_1.body)('devices.*.hoursPerDay').isInt({ min: 1, max: 24 }).withMessage('Hours per day must be between 1 and 24'),
    (0, express_validator_1.body)('devices.*.powerConsumption').isInt({ min: 1 }).withMessage('Power consumption must be at least 1 watt'),
];
exports.validateUpdatePlan = [
    (0, express_validator_1.body)('name').optional().trim().notEmpty().withMessage('Plan name cannot be empty'),
    (0, express_validator_1.body)('category').optional().isIn(['HOME', 'BUSINESS', 'FARM']).withMessage('Category must be HOME, BUSINESS, or FARM'),
    (0, express_validator_1.body)('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
    (0, express_validator_1.body)('sunlightHours').optional().isFloat({ min: 1, max: 12 }).withMessage('Sunlight hours must be between 1 and 12'),
    (0, express_validator_1.body)('status').optional().isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED']).withMessage('Invalid status'),
    (0, express_validator_1.body)('devices').optional().isArray().withMessage('Devices must be an array'),
];
exports.validatePagination = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('sortBy').optional().isIn(['name', 'createdAt', 'updatedAt', 'category']).withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
];
const createPlan = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            (0, response_1.sendValidationError)(res, errors.array());
            return;
        }
        if (!req.user) {
            (0, response_1.sendError)(res, 'Authentication required', 401);
            return;
        }
        const plan = await planService.createPlan(req.user.id, req.body);
        (0, response_1.sendSuccess)(res, plan, 'Solar plan created successfully', 201);
    }
    catch (error) {
        logger_1.default.error('Create plan error:', error);
        (0, response_1.sendError)(res, error.message || 'Failed to create plan', 400);
    }
};
exports.createPlan = createPlan;
const getUserPlans = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            (0, response_1.sendValidationError)(res, errors.array());
            return;
        }
        if (!req.user) {
            (0, response_1.sendError)(res, 'Authentication required', 401);
            return;
        }
        const { page, limit, sortBy, sortOrder } = req.query;
        const paginationParams = {
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            sortBy: sortBy,
            sortOrder: sortOrder,
        };
        const result = await planService.getUserPlans(req.user.id, paginationParams);
        (0, response_1.sendSuccess)(res, result, 'Plans retrieved successfully');
    }
    catch (error) {
        logger_1.default.error('Get user plans error:', error);
        (0, response_1.sendError)(res, error.message || 'Failed to get plans', 500);
    }
};
exports.getUserPlans = getUserPlans;
const getPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const plan = await planService.getPlanById(id, userId);
        (0, response_1.sendSuccess)(res, plan, 'Plan retrieved successfully');
    }
    catch (error) {
        logger_1.default.error('Get plan by ID error:', error);
        const statusCode = error.message.includes('not found') ? 404 :
            error.message.includes('Access denied') ? 403 : 500;
        (0, response_1.sendError)(res, error.message || 'Failed to get plan', statusCode);
    }
};
exports.getPlanById = getPlanById;
const updatePlan = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            (0, response_1.sendValidationError)(res, errors.array());
            return;
        }
        if (!req.user) {
            (0, response_1.sendError)(res, 'Authentication required', 401);
            return;
        }
        const { id } = req.params;
        const plan = await planService.updatePlan(id, req.user.id, req.body);
        (0, response_1.sendSuccess)(res, plan, 'Plan updated successfully');
    }
    catch (error) {
        logger_1.default.error('Update plan error:', error);
        const statusCode = error.message.includes('not found') || error.message.includes('Access denied') ? 404 : 400;
        (0, response_1.sendError)(res, error.message || 'Failed to update plan', statusCode);
    }
};
exports.updatePlan = updatePlan;
const deletePlan = async (req, res) => {
    try {
        if (!req.user) {
            (0, response_1.sendError)(res, 'Authentication required', 401);
            return;
        }
        const { id } = req.params;
        await planService.deletePlan(id, req.user.id);
        (0, response_1.sendSuccess)(res, null, 'Plan deleted successfully');
    }
    catch (error) {
        logger_1.default.error('Delete plan error:', error);
        const statusCode = error.message.includes('not found') || error.message.includes('Access denied') ? 404 : 400;
        (0, response_1.sendError)(res, error.message || 'Failed to delete plan', statusCode);
    }
};
exports.deletePlan = deletePlan;
const duplicatePlan = async (req, res) => {
    try {
        if (!req.user) {
            (0, response_1.sendError)(res, 'Authentication required', 401);
            return;
        }
        const { id } = req.params;
        const { name } = req.body;
        const plan = await planService.duplicatePlan(id, req.user.id, name);
        (0, response_1.sendSuccess)(res, plan, 'Plan duplicated successfully', 201);
    }
    catch (error) {
        logger_1.default.error('Duplicate plan error:', error);
        const statusCode = error.message.includes('not found') || error.message.includes('Access denied') ? 404 : 400;
        (0, response_1.sendError)(res, error.message || 'Failed to duplicate plan', statusCode);
    }
};
exports.duplicatePlan = duplicatePlan;
const sharePlan = async (req, res) => {
    try {
        if (!req.user) {
            (0, response_1.sendError)(res, 'Authentication required', 401);
            return;
        }
        const { id } = req.params;
        const result = await planService.sharePlan(id, req.user.id);
        (0, response_1.sendSuccess)(res, result, 'Plan shared successfully');
    }
    catch (error) {
        logger_1.default.error('Share plan error:', error);
        const statusCode = error.message.includes('not found') || error.message.includes('Access denied') ? 404 : 400;
        (0, response_1.sendError)(res, error.message || 'Failed to share plan', statusCode);
    }
};
exports.sharePlan = sharePlan;
const getSharedPlan = async (req, res) => {
    try {
        const { token } = req.params;
        const plan = await planService.getSharedPlan(token);
        (0, response_1.sendSuccess)(res, plan, 'Shared plan retrieved successfully');
    }
    catch (error) {
        logger_1.default.error('Get shared plan error:', error);
        (0, response_1.sendError)(res, error.message || 'Failed to get shared plan', 404);
    }
};
exports.getSharedPlan = getSharedPlan;
//# sourceMappingURL=planController.js.map