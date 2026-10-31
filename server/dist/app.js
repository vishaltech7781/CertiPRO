"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_js_1 = require("./config/env.js");
const errorMiddleware_js_1 = require("./middleware/errorMiddleware.js");
const rateLimiter_js_1 = require("./middleware/rateLimiter.js");
// Route imports
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const courseRoutes_js_1 = __importDefault(require("./routes/courseRoutes.js"));
const categoryRoutes_js_1 = __importDefault(require("./routes/categoryRoutes.js"));
const meRoutes_js_1 = __importDefault(require("./routes/meRoutes.js"));
const quizRoutes_js_1 = __importDefault(require("./routes/quizRoutes.js"));
const codingRoutes_js_1 = __importDefault(require("./routes/codingRoutes.js"));
const certificateRoutes_js_1 = __importDefault(require("./routes/certificateRoutes.js"));
const adminRoutes_js_1 = __importDefault(require("./routes/adminRoutes.js"));
const app = (0, express_1.default)();
// Security Headers
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // allow YouTube embeds and fonts in development/production
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
// CORS
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin)
            return callback(null, true);
        if (origin === env_js_1.env.CLIENT_URL ||
            origin.startsWith('http://localhost') ||
            origin.startsWith('http://127.0.0.1')) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Parsers
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '5mb' }));
app.use((0, cookie_parser_1.default)(env_js_1.env.COOKIE_SECRET));
// Rate Limiting on general API
app.use('/api', rateLimiter_js_1.apiRateLimiter);
// Health Check
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        service: 'CertiPro API',
        version: '1.0.0',
    });
});
// Mount Routes
app.use('/api/v1/auth', authRoutes_js_1.default);
app.use('/api/v1/courses', courseRoutes_js_1.default);
app.use('/api/v1/categories', categoryRoutes_js_1.default);
app.use('/api/v1/me', meRoutes_js_1.default);
app.use('/api/v1/quizzes', quizRoutes_js_1.default);
app.use('/api/v1/challenges', codingRoutes_js_1.default);
app.use('/api/v1/certificates', certificateRoutes_js_1.default);
app.use('/api/v1/admin', adminRoutes_js_1.default);
// 404 Route Catch
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.originalUrl} not found on CertiPro API`,
    });
});
// Centralized Error Handling
app.use(errorMiddleware_js_1.errorHandler);
exports.default = app;
