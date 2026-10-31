"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.optionalAuth = optionalAuth;
exports.requireAdmin = requireAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
const User_js_1 = require("../models/User.js");
async function requireAuth(req, res, next) {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies && req.cookies.cp_token) {
            token = req.cookies.cp_token;
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication required. Please log in to continue.',
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_js_1.env.JWT_SECRET);
        const user = await User_js_1.User.findById(decoded.id);
        if (!user || user.accountStatus === 'suspended') {
            res.status(401).json({
                success: false,
                message: 'Account not found or session expired. Please log in again.',
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication token. Please log in again.',
        });
    }
}
async function optionalAuth(req, res, next) {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies && req.cookies.cp_token) {
            token = req.cookies.cp_token;
        }
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, env_js_1.env.JWT_SECRET);
            const user = await User_js_1.User.findById(decoded.id);
            if (user && user.accountStatus !== 'suspended') {
                req.user = user;
            }
        }
    }
    catch {
        // Ignore invalid token in optionalAuth
    }
    next();
}
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({
            success: false,
            message: 'Forbidden. Administrator privileges required.',
        });
        return;
    }
    next();
}
