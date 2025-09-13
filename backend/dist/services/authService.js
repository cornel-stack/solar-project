"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = __importDefault(require("@/config/database"));
const password_1 = require("@/utils/password");
const jwt_1 = require("@/utils/jwt");
class AuthService {
    async register(data) {
        // Check if user already exists
        const existingUser = await database_1.default.user.findUnique({
            where: { email: data.email }
        });
        if (existingUser) {
            throw new Error('User already exists with this email');
        }
        // Hash password
        const passwordHash = await (0, password_1.hashPassword)(data.password);
        // Create user
        const user = await database_1.default.user.create({
            data: {
                email: data.email,
                passwordHash,
                name: data.name,
                phone: data.phone,
            }
        });
        // Generate tokens
        const tokenPayload = { userId: user.id, email: user.email };
        const { accessToken, refreshToken } = (0, jwt_1.generateTokenPair)(tokenPayload);
        // Store refresh token
        await database_1.default.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            }
        });
        // Remove password hash from response
        const { passwordHash: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    }
    async login(data) {
        // Find user
        const user = await database_1.default.user.findUnique({
            where: { email: data.email }
        });
        if (!user || !user.passwordHash) {
            throw new Error('Invalid email or password');
        }
        // Verify password
        const isPasswordValid = await (0, password_1.verifyPassword)(data.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        // Update last login
        await database_1.default.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });
        // Generate tokens
        const tokenPayload = { userId: user.id, email: user.email };
        const { accessToken, refreshToken } = (0, jwt_1.generateTokenPair)(tokenPayload);
        // Store refresh token
        await database_1.default.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            }
        });
        // Remove password hash from response
        const { passwordHash: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    }
    async refreshTokens(refreshToken) {
        // Find refresh token in database
        const storedToken = await database_1.default.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true }
        });
        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new Error('Invalid or expired refresh token');
        }
        // Generate new tokens
        const tokenPayload = { userId: storedToken.user.id, email: storedToken.user.email };
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = (0, jwt_1.generateTokenPair)(tokenPayload);
        // Replace old refresh token with new one
        await database_1.default.refreshToken.update({
            where: { id: storedToken.id },
            data: {
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            }
        });
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
    async logout(refreshToken) {
        // Remove refresh token from database
        await database_1.default.refreshToken.deleteMany({
            where: { token: refreshToken }
        });
    }
    async logoutAllDevices(userId) {
        // Remove all refresh tokens for user
        await database_1.default.refreshToken.deleteMany({
            where: { userId }
        });
    }
    async updateProfile(userId, data) {
        const updatedUser = await database_1.default.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                phone: data.phone,
                preferences: data.preferences,
                updatedAt: new Date(),
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                preferences: true,
            }
        });
        return updatedUser;
    }
    async storeRefreshToken(refreshToken, userId) {
        await database_1.default.refreshToken.create({
            data: {
                token: refreshToken,
                userId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            }
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map