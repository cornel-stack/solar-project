"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticate = void 0;
const jwt_1 = require("@/utils/jwt");
const response_1 = require("@/utils/response");
const database_1 = __importDefault(require("@/config/database"));
const logger_1 = __importDefault(require("@/utils/logger"));
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            (0, response_1.sendError)(res, 'Authentication required', 401);
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            (0, response_1.sendError)(res, 'Authentication token required', 401);
            return;
        }
        try {
            const payload = (0, jwt_1.verifyAccessToken)(token);
            // Fetch user from database
            const user = await database_1.default.user.findUnique({
                where: { id: payload.userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    emailVerified: true,
                    provider: true,
                    createdAt: true,
                    updatedAt: true,
                    preferences: true,
                }
            });
            if (!user) {
                (0, response_1.sendError)(res, 'User not found', 401);
                return;
            }
            req.user = user;
            next();
        }
        catch (jwtError) {
            (0, response_1.sendError)(res, 'Invalid authentication token', 401);
            return;
        }
    }
    catch (error) {
        logger_1.default.error('Authentication middleware error:', error);
        (0, response_1.sendError)(res, 'Authentication failed', 500);
        return;
    }
};
exports.authenticate = authenticate;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            if (token) {
                try {
                    const payload = (0, jwt_1.verifyAccessToken)(token);
                    const user = await database_1.default.user.findUnique({
                        where: { id: payload.userId },
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            phone: true,
                            emailVerified: true,
                            provider: true,
                            createdAt: true,
                            updatedAt: true,
                            preferences: true,
                        }
                    });
                    if (user) {
                        req.user = user;
                    }
                }
                catch (jwtError) {
                    // Silently ignore invalid tokens for optional auth
                }
            }
        }
        next();
    }
    catch (error) {
        logger_1.default.error('Optional auth middleware error:', error);
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map