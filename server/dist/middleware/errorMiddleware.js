"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const env_js_1 = require("../config/env.js");
function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';
    if (env_js_1.env.NODE_ENV !== 'test') {
        console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
    }
    res.status(statusCode).json({
        success: false,
        message,
        ...(env_js_1.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}
