"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const db_js_1 = require("./config/db.js");
const env_js_1 = require("./config/env.js");
async function bootstrap() {
    await (0, db_js_1.connectDB)();
    const server = app_js_1.default.listen(env_js_1.env.PORT, () => {
        console.log(`[CertiPro Server] Running on http://localhost:${env_js_1.env.PORT} in ${env_js_1.env.NODE_ENV} mode`);
        console.log(`[CertiPro Server] Health Check: http://localhost:${env_js_1.env.PORT}/api/v1/health`);
    });
    const gracefulShutdown = () => {
        console.log('[CertiPro Server] Gracefully shutting down...');
        server.close(() => {
            console.log('[CertiPro Server] HTTP server closed.');
            process.exit(0);
        });
    };
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
}
bootstrap().catch((err) => {
    console.error('[CertiPro Server] Fatal startup error:', err);
    process.exit(1);
});
