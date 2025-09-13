import { Response } from 'express';
import { AuthRequest } from '@/types';
export declare const validateCreatePlan: import("express-validator").ValidationChain[];
export declare const validateUpdatePlan: import("express-validator").ValidationChain[];
export declare const validatePagination: import("express-validator").ValidationChain[];
export declare const createPlan: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUserPlans: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPlanById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updatePlan: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deletePlan: (req: AuthRequest, res: Response) => Promise<void>;
export declare const duplicatePlan: (req: AuthRequest, res: Response) => Promise<void>;
export declare const sharePlan: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSharedPlan: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=planController.d.ts.map