"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanService = void 0;
const database_1 = __importDefault(require("@/config/database"));
const solarCalculationService_1 = require("./solarCalculationService");
const uuid_1 = require("uuid");
class PlanService {
    calculationService = new solarCalculationService_1.SolarCalculationService();
    async createPlan(userId, data) {
        // Create the plan
        const plan = await database_1.default.solarPlan.create({
            data: {
                userId,
                name: data.name,
                category: data.category,
                location: data.location,
                sunlightHours: data.sunlightHours,
                status: 'DRAFT',
            },
            include: {
                devices: true,
            }
        });
        // Add devices
        if (data.devices.length > 0) {
            await database_1.default.device.createMany({
                data: data.devices.map(device => ({
                    planId: plan.id,
                    deviceType: device.type,
                    quantity: device.quantity,
                    hoursPerDay: device.hoursPerDay,
                    powerConsumption: device.powerConsumption,
                }))
            });
        }
        // Calculate and store results
        const calculationResult = this.calculationService.calculateSolarSystem({
            category: data.category,
            location: data.location,
            sunlightHours: data.sunlightHours,
            devices: data.devices,
        });
        // Store calculation
        await database_1.default.calculation.create({
            data: {
                planId: plan.id,
                energyDemand: calculationResult.energyDemand,
                panelSize: calculationResult.panelSize,
                batteryCapacity: calculationResult.batteryCapacity,
                inverterSize: calculationResult.inverterSize,
                upfrontCost: calculationResult.upfrontCost,
                annualSavings: calculationResult.annualSavings,
                paybackPeriod: calculationResult.paybackPeriod,
                roi: calculationResult.roi,
                co2Reduction: calculationResult.co2Reduction,
                costBreakdown: calculationResult.costBreakdown,
            }
        });
        // Update plan with calculation results
        const updatedPlan = await database_1.default.solarPlan.update({
            where: { id: plan.id },
            data: {
                systemSpecs: {
                    energyDemand: calculationResult.energyDemand,
                    panelSize: calculationResult.panelSize,
                    batteryCapacity: calculationResult.batteryCapacity,
                    inverterSize: calculationResult.inverterSize,
                },
                financialData: {
                    upfrontCost: calculationResult.upfrontCost,
                    annualSavings: calculationResult.annualSavings,
                    paybackPeriod: calculationResult.paybackPeriod,
                    roi: calculationResult.roi,
                    co2Reduction: calculationResult.co2Reduction,
                },
            },
            include: {
                devices: true,
                calculations: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            }
        });
        return updatedPlan;
    }
    async getUserPlans(userId, params = {}) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
        const skip = (page - 1) * limit;
        const orderBy = { [sortBy]: sortOrder };
        const [plans, total] = await Promise.all([
            database_1.default.solarPlan.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy,
                include: {
                    devices: true,
                    calculations: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                    },
                    _count: {
                        select: { quotes: true },
                    },
                },
            }),
            database_1.default.solarPlan.count({ where: { userId } }),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            data: plans,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }
    async getPlanById(planId, userId) {
        const plan = await database_1.default.solarPlan.findUnique({
            where: { id: planId },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                devices: true,
                calculations: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                quotes: {
                    where: userId ? { userId } : undefined,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!plan) {
            throw new Error('Plan not found');
        }
        // Check if user has access to this plan
        if (!plan.isPublic && plan.userId !== userId) {
            throw new Error('Access denied');
        }
        return plan;
    }
    async updatePlan(planId, userId, data) {
        // Verify ownership
        const existingPlan = await database_1.default.solarPlan.findFirst({
            where: { id: planId, userId },
        });
        if (!existingPlan) {
            throw new Error('Plan not found or access denied');
        }
        // Update plan
        const updatedPlan = await database_1.default.solarPlan.update({
            where: { id: planId },
            data: {
                name: data.name,
                category: data.category,
                location: data.location,
                sunlightHours: data.sunlightHours,
                status: data.status,
            },
        });
        // Update devices if provided
        if (data.devices) {
            // Remove existing devices
            await database_1.default.device.deleteMany({
                where: { planId },
            });
            // Add new devices
            if (data.devices.length > 0) {
                await database_1.default.device.createMany({
                    data: data.devices.map(device => ({
                        planId,
                        deviceType: device.type,
                        quantity: device.quantity,
                        hoursPerDay: device.hoursPerDay,
                        powerConsumption: device.powerConsumption,
                    }))
                });
            }
            // Recalculate if devices or parameters changed
            const calculationResult = this.calculationService.calculateSolarSystem({
                category: data.category || existingPlan.category,
                location: data.location || existingPlan.location,
                sunlightHours: data.sunlightHours || existingPlan.sunlightHours,
                devices: data.devices,
            });
            // Store new calculation
            await database_1.default.calculation.create({
                data: {
                    planId,
                    energyDemand: calculationResult.energyDemand,
                    panelSize: calculationResult.panelSize,
                    batteryCapacity: calculationResult.batteryCapacity,
                    inverterSize: calculationResult.inverterSize,
                    upfrontCost: calculationResult.upfrontCost,
                    annualSavings: calculationResult.annualSavings,
                    paybackPeriod: calculationResult.paybackPeriod,
                    roi: calculationResult.roi,
                    co2Reduction: calculationResult.co2Reduction,
                    costBreakdown: calculationResult.costBreakdown,
                }
            });
            // Update plan with new calculation results
            await database_1.default.solarPlan.update({
                where: { id: planId },
                data: {
                    systemSpecs: {
                        energyDemand: calculationResult.energyDemand,
                        panelSize: calculationResult.panelSize,
                        batteryCapacity: calculationResult.batteryCapacity,
                        inverterSize: calculationResult.inverterSize,
                    },
                    financialData: {
                        upfrontCost: calculationResult.upfrontCost,
                        annualSavings: calculationResult.annualSavings,
                        paybackPeriod: calculationResult.paybackPeriod,
                        roi: calculationResult.roi,
                        co2Reduction: calculationResult.co2Reduction,
                    },
                },
            });
        }
        return this.getPlanById(planId, userId);
    }
    async deletePlan(planId, userId) {
        // Verify ownership
        const plan = await database_1.default.solarPlan.findFirst({
            where: { id: planId, userId },
        });
        if (!plan) {
            throw new Error('Plan not found or access denied');
        }
        await database_1.default.solarPlan.delete({
            where: { id: planId },
        });
    }
    async duplicatePlan(planId, userId, newName) {
        const originalPlan = await this.getPlanById(planId, userId);
        const devices = originalPlan.devices.map(device => ({
            type: device.deviceType,
            quantity: device.quantity,
            hoursPerDay: device.hoursPerDay,
            powerConsumption: device.powerConsumption,
        }));
        return this.createPlan(userId, {
            name: newName || `${originalPlan.name} (Copy)`,
            category: originalPlan.category,
            location: originalPlan.location,
            sunlightHours: originalPlan.sunlightHours,
            devices,
        });
    }
    async sharePlan(planId, userId) {
        // Verify ownership
        const plan = await database_1.default.solarPlan.findFirst({
            where: { id: planId, userId },
        });
        if (!plan) {
            throw new Error('Plan not found or access denied');
        }
        const shareToken = (0, uuid_1.v4)();
        const updatedPlan = await database_1.default.solarPlan.update({
            where: { id: planId },
            data: {
                sharedToken: shareToken,
                isPublic: true,
            },
        });
        return {
            shareToken,
            shareUrl: `${process.env.FRONTEND_URL}/shared/${shareToken}`,
        };
    }
    async getSharedPlan(shareToken) {
        const plan = await database_1.default.solarPlan.findUnique({
            where: { sharedToken: shareToken },
            include: {
                user: {
                    select: { id: true, name: true },
                },
                devices: true,
                calculations: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
        if (!plan || !plan.isPublic) {
            throw new Error('Shared plan not found or no longer available');
        }
        return plan;
    }
}
exports.PlanService = PlanService;
//# sourceMappingURL=planService.js.map