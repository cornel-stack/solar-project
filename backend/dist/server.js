"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const config_1 = __importDefault(require("@/config"));
const routes_1 = __importDefault(require("@/routes"));
const passport_2 = require("@/config/passport");
const security_1 = require("@/middleware/security");
const logger_1 = __importDefault(require("@/utils/logger"));
const app = (0, express_1.default)();
// Trust proxy for accurate IP addresses when behind reverse proxy
app.set('trust proxy', 1);
// Security middleware
app.use(security_1.helmetConfig);
app.use((0, cors_1.default)(security_1.corsOptions));
// Rate limiting
app.use((0, security_1.createRateLimiter)());
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Cookie parsing
app.use((0, cookie_parser_1.default)(config_1.default.cookieSecret));
// Session configuration for Passport
app.use((0, express_session_1.default)({
    secret: config_1.default.cookieSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: config_1.default.nodeEnv === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
// Initialize Passport
(0, passport_2.setupPassport)();
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Request logging (in development)
if (config_1.default.nodeEnv === 'development') {
    app.use(security_1.requestLogger);
}
// API routes
app.use('/api', routes_1.default);
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'SolarAfrica Planner API',
        version: '1.0.0',
        documentation: '/api/health',
    });
});
// 404 handler
app.use(security_1.notFoundHandler);
// Error handling middleware (must be last)
app.use(security_1.errorHandler);
// Start server
const startServer = async () => {
    try {
        const server = app.listen(config_1.default.port, () => {
            logger_1.default.info(`🚀 Server running on port ${config_1.default.port}`);
            logger_1.default.info(`📝 Environment: ${config_1.default.nodeEnv}`);
            logger_1.default.info(`🌐 Frontend URL: ${config_1.default.frontendUrl}`);
            if (config_1.default.nodeEnv === 'development') {
                logger_1.default.info(`🔍 API Health: http://localhost:${config_1.default.port}/api/health`);
                logger_1.default.info(`📊 API Docs: http://localhost:${config_1.default.port}/api`);
            }
        });
        // Graceful shutdown
        const gracefulShutdown = (signal) => {
            logger_1.default.info(`Received ${signal}. Starting graceful shutdown...`);
            server.close(() => {
                logger_1.default.info('HTTP server closed.');
                process.exit(0);
            });
            // Force close server after 30 seconds
            setTimeout(() => {
                logger_1.default.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 30000);
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map