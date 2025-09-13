"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleCallback = exports.googleAuth = exports.updateProfile = exports.getProfile = exports.logout = exports.refreshToken = exports.login = exports.register = exports.validateLogin = exports.validateRegister = void 0;
const authService_1 = require("@/services/authService");
const response_1 = require("@/utils/response");
const logger_1 = __importDefault(require("@/utils/logger"));
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const jwt_1 = require("@/utils/jwt");
const authService = new authService_1.AuthService();
exports.validateRegister = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('name').optional().trim().isLength({ min: 1 }).withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('phone').optional().trim().isLength({ min: 1 }).withMessage('Phone cannot be empty'),
];
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
const register = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            (0, response_1.sendValidationError)(res, errors.array());
            return;
        }
        const { email, password, name, phone } = req.body;
        const result = await authService.register({ email, password, name, phone });
        // Set refresh token in httpOnly cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        (0, response_1.sendSuccess)(res, {
            user: result.user,
            accessToken: result.accessToken,
        }, 'User registered successfully', 201);
    }
    catch (error) {
        logger_1.default.error('Register error:', error);
        (0, response_1.sendError)(res, error.message || 'Registration failed', 400);
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            (0, response_1.sendValidationError)(res, errors.array());
            return;
        }
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        // Set refresh token in httpOnly cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        (0, response_1.sendSuccess)(res, {
            user: result.user,
            accessToken: result.accessToken,
        }, 'Login successful');
    }
    catch (error) {
        logger_1.default.error('Login error:', error);
        (0, response_1.sendError)(res, error.message || 'Login failed', 400);
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (!refreshToken) {
            (0, response_1.sendError)(res, 'Refresh token is required', 401);
            return;
        }
        const result = await authService.refreshTokens(refreshToken);
        // Set new refresh token in httpOnly cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        (0, response_1.sendSuccess)(res, {
            accessToken: result.accessToken,
        }, 'Token refreshed successfully');
    }
    catch (error) {
        logger_1.default.error('Refresh token error:', error);
        (0, response_1.sendError)(res, error.message || 'Token refresh failed', 401);
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (refreshToken) {
            await authService.logout(refreshToken);
        }
        // Clear refresh token cookie
        res.clearCookie('refreshToken');
        (0, response_1.sendSuccess)(res, null, 'Logout successful');
    }
    catch (error) {
        logger_1.default.error('Logout error:', error);
        (0, response_1.sendError)(res, error.message || 'Logout failed', 400);
    }
};
exports.logout = logout;
const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            (0, response_1.sendError)(res, 'User not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, req.user, 'Profile retrieved successfully');
    }
    catch (error) {
        logger_1.default.error('Get profile error:', error);
        (0, response_1.sendError)(res, error.message || 'Failed to get profile', 400);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            (0, response_1.sendError)(res, 'User not found', 404);
            return;
        }
        const { name, phone, preferences } = req.body;
        const updatedUser = await authService.updateProfile(req.user.id, {
            name,
            phone,
            preferences,
        });
        (0, response_1.sendSuccess)(res, updatedUser, 'Profile updated successfully');
    }
    catch (error) {
        logger_1.default.error('Update profile error:', error);
        (0, response_1.sendError)(res, error.message || 'Failed to update profile', 400);
    }
};
exports.updateProfile = updateProfile;
// Google OAuth routes
exports.googleAuth = passport_1.default.authenticate('google', {
    scope: ['profile', 'email']
});
const googleCallback = (req, res) => {
    passport_1.default.authenticate('google', { session: false }, async (err, user) => {
        try {
            if (err || !user) {
                const errorMessage = err?.message || 'Google authentication failed';
                logger_1.default.error('Google auth error:', errorMessage);
                return res.redirect(`${process.env.FRONTEND_URL}/auth?error=${encodeURIComponent(errorMessage)}`);
            }
            // Generate JWT tokens for the user
            const tokenPayload = { userId: user.id, email: user.email };
            const { accessToken, refreshToken } = (0, jwt_1.generateTokenPair)(tokenPayload);
            // Store refresh token in database
            await authService.storeRefreshToken(refreshToken, user.id);
            // Set refresh token in httpOnly cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            // Remove sensitive data from user object
            const { passwordHash, ...userWithoutPassword } = user;
            // Redirect to frontend with success and user data
            const userData = encodeURIComponent(JSON.stringify({
                user: userWithoutPassword,
                accessToken
            }));
            res.redirect(`${process.env.FRONTEND_URL}/auth?success=true&data=${userData}`);
        }
        catch (error) {
            logger_1.default.error('Google callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/auth?error=${encodeURIComponent('Authentication processing failed')}`);
        }
    })(req, res);
};
exports.googleCallback = googleCallback;
//# sourceMappingURL=authController.js.map