import { PlanCategory, PlanStatus } from '@prisma/client';
import { PaginationParams, PaginatedResponse } from '@/types';
export interface CreatePlanData {
    name: string;
    category: PlanCategory;
    location: string;
    sunlightHours: number;
    devices: Array<{
        type: string;
        quantity: number;
        hoursPerDay: number;
        powerConsumption: number;
    }>;
}
export interface UpdatePlanData extends Partial<CreatePlanData> {
    status?: PlanStatus;
}
export declare class PlanService {
    private calculationService;
    createPlan(userId: string, data: CreatePlanData): Promise<{
        devices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            planId: string;
            deviceType: string;
            quantity: number;
            hoursPerDay: number;
            powerConsumption: number;
            isCustomDevice: boolean;
        }[];
        calculations: {
            id: string;
            createdAt: Date;
            energyDemand: number;
            panelSize: number;
            batteryCapacity: number;
            inverterSize: number;
            upfrontCost: number;
            annualSavings: number;
            paybackPeriod: number;
            roi: number;
            co2Reduction: number;
            costBreakdown: import("@prisma/client/runtime/library").JsonValue;
            calculationVersion: string;
            planId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        category: import(".prisma/client").$Enums.PlanCategory;
        location: string;
        sunlightHours: number;
        status: import(".prisma/client").$Enums.PlanStatus;
        systemSpecs: import("@prisma/client/runtime/library").JsonValue | null;
        financialData: import("@prisma/client/runtime/library").JsonValue | null;
        sharedToken: string | null;
        isPublic: boolean;
    }>;
    getUserPlans(userId: string, params?: PaginationParams): Promise<PaginatedResponse<any>>;
    getPlanById(planId: string, userId?: string): Promise<{
        user: {
            name: string | null;
            id: string;
            email: string;
        };
        quotes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date | null;
            userId: string;
            status: import(".prisma/client").$Enums.QuoteStatus;
            planId: string;
            contactName: string;
            contactEmail: string;
            contactPhone: string | null;
            quoteAmount: number | null;
            installationDays: number | null;
            notes: string | null;
            respondedAt: Date | null;
        }[];
        devices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            planId: string;
            deviceType: string;
            quantity: number;
            hoursPerDay: number;
            powerConsumption: number;
            isCustomDevice: boolean;
        }[];
        calculations: {
            id: string;
            createdAt: Date;
            energyDemand: number;
            panelSize: number;
            batteryCapacity: number;
            inverterSize: number;
            upfrontCost: number;
            annualSavings: number;
            paybackPeriod: number;
            roi: number;
            co2Reduction: number;
            costBreakdown: import("@prisma/client/runtime/library").JsonValue;
            calculationVersion: string;
            planId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        category: import(".prisma/client").$Enums.PlanCategory;
        location: string;
        sunlightHours: number;
        status: import(".prisma/client").$Enums.PlanStatus;
        systemSpecs: import("@prisma/client/runtime/library").JsonValue | null;
        financialData: import("@prisma/client/runtime/library").JsonValue | null;
        sharedToken: string | null;
        isPublic: boolean;
    }>;
    updatePlan(planId: string, userId: string, data: UpdatePlanData): Promise<{
        user: {
            name: string | null;
            id: string;
            email: string;
        };
        quotes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date | null;
            userId: string;
            status: import(".prisma/client").$Enums.QuoteStatus;
            planId: string;
            contactName: string;
            contactEmail: string;
            contactPhone: string | null;
            quoteAmount: number | null;
            installationDays: number | null;
            notes: string | null;
            respondedAt: Date | null;
        }[];
        devices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            planId: string;
            deviceType: string;
            quantity: number;
            hoursPerDay: number;
            powerConsumption: number;
            isCustomDevice: boolean;
        }[];
        calculations: {
            id: string;
            createdAt: Date;
            energyDemand: number;
            panelSize: number;
            batteryCapacity: number;
            inverterSize: number;
            upfrontCost: number;
            annualSavings: number;
            paybackPeriod: number;
            roi: number;
            co2Reduction: number;
            costBreakdown: import("@prisma/client/runtime/library").JsonValue;
            calculationVersion: string;
            planId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        category: import(".prisma/client").$Enums.PlanCategory;
        location: string;
        sunlightHours: number;
        status: import(".prisma/client").$Enums.PlanStatus;
        systemSpecs: import("@prisma/client/runtime/library").JsonValue | null;
        financialData: import("@prisma/client/runtime/library").JsonValue | null;
        sharedToken: string | null;
        isPublic: boolean;
    }>;
    deletePlan(planId: string, userId: string): Promise<void>;
    duplicatePlan(planId: string, userId: string, newName?: string): Promise<{
        devices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            planId: string;
            deviceType: string;
            quantity: number;
            hoursPerDay: number;
            powerConsumption: number;
            isCustomDevice: boolean;
        }[];
        calculations: {
            id: string;
            createdAt: Date;
            energyDemand: number;
            panelSize: number;
            batteryCapacity: number;
            inverterSize: number;
            upfrontCost: number;
            annualSavings: number;
            paybackPeriod: number;
            roi: number;
            co2Reduction: number;
            costBreakdown: import("@prisma/client/runtime/library").JsonValue;
            calculationVersion: string;
            planId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        category: import(".prisma/client").$Enums.PlanCategory;
        location: string;
        sunlightHours: number;
        status: import(".prisma/client").$Enums.PlanStatus;
        systemSpecs: import("@prisma/client/runtime/library").JsonValue | null;
        financialData: import("@prisma/client/runtime/library").JsonValue | null;
        sharedToken: string | null;
        isPublic: boolean;
    }>;
    sharePlan(planId: string, userId: string): Promise<{
        shareToken: string;
        shareUrl: string;
    }>;
    getSharedPlan(shareToken: string): Promise<{
        user: {
            name: string | null;
            id: string;
        };
        devices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            planId: string;
            deviceType: string;
            quantity: number;
            hoursPerDay: number;
            powerConsumption: number;
            isCustomDevice: boolean;
        }[];
        calculations: {
            id: string;
            createdAt: Date;
            energyDemand: number;
            panelSize: number;
            batteryCapacity: number;
            inverterSize: number;
            upfrontCost: number;
            annualSavings: number;
            paybackPeriod: number;
            roi: number;
            co2Reduction: number;
            costBreakdown: import("@prisma/client/runtime/library").JsonValue;
            calculationVersion: string;
            planId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        category: import(".prisma/client").$Enums.PlanCategory;
        location: string;
        sunlightHours: number;
        status: import(".prisma/client").$Enums.PlanStatus;
        systemSpecs: import("@prisma/client/runtime/library").JsonValue | null;
        financialData: import("@prisma/client/runtime/library").JsonValue | null;
        sharedToken: string | null;
        isPublic: boolean;
    }>;
}
//# sourceMappingURL=planService.d.ts.map