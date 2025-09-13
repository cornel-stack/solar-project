export declare const config: {
    port: number;
    nodeEnv: string;
    databaseUrl: string;
    jwtSecret: string;
    jwtRefreshSecret: string;
    jwtExpiresIn: string;
    jwtRefreshExpiresIn: string;
    frontendUrl: string;
    bcryptRounds: number;
    cookieSecret: string;
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
    smtp: {
        host: string | undefined;
        port: number;
        user: string | undefined;
        pass: string | undefined;
    };
    google: {
        clientId: string | undefined;
        clientSecret: string | undefined;
    };
};
export default config;
//# sourceMappingURL=index.d.ts.map