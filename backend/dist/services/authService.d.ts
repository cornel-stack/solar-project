import { User } from '@prisma/client';
export interface RegisterData {
    email: string;
    password: string;
    name?: string;
    phone?: string;
}
export interface LoginData {
    email: string;
    password: string;
}
export interface AuthResult {
    user: Omit<User, 'passwordHash'>;
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    register(data: RegisterData): Promise<AuthResult>;
    login(data: LoginData): Promise<AuthResult>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
    logoutAllDevices(userId: string): Promise<void>;
    updateProfile(userId: string, data: {
        name?: string;
        phone?: string;
        preferences?: any;
    }): Promise<{
        name: string | null;
        id: string;
        email: string;
        phone: string | null;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        preferences: import("@prisma/client/runtime/library").JsonValue;
    }>;
    storeRefreshToken(refreshToken: string, userId: string): Promise<void>;
}
//# sourceMappingURL=authService.d.ts.map