"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const planController_1 = require("@/controllers/planController");
const auth_1 = require("@/middleware/auth");
const router = (0, express_1.Router)();
// Protected routes (require authentication)
router.post('/', auth_1.authenticate, planController_1.validateCreatePlan, planController_1.createPlan);
router.get('/', auth_1.authenticate, planController_1.validatePagination, planController_1.getUserPlans);
router.get('/:id', auth_1.optionalAuth, planController_1.getPlanById);
router.put('/:id', auth_1.authenticate, planController_1.validateUpdatePlan, planController_1.updatePlan);
router.delete('/:id', auth_1.authenticate, planController_1.deletePlan);
router.post('/:id/duplicate', auth_1.authenticate, planController_1.duplicatePlan);
router.post('/:id/share', auth_1.authenticate, planController_1.sharePlan);
// Public shared plan route
router.get('/shared/:token', planController_1.getSharedPlan);
exports.default = router;
//# sourceMappingURL=plans.js.map