import { Response } from 'express';
export declare const sendSuccess: <T>(res: Response, data?: T, message?: string, statusCode?: number) => Response;
export declare const sendError: (res: Response, error: string, statusCode?: number, errors?: any[]) => Response;
export declare const sendValidationError: (res: Response, errors: any[], message?: string) => Response;
//# sourceMappingURL=response.d.ts.map