"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
const User_js_1 = require("../models/User.js");
const PasswordResetToken_js_1 = require("../models/PasswordResetToken.js");
const emailService_js_1 = require("../services/emailService.js");
class AuthController {
    static async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const existingUser = await User_js_1.User.findOne({ email });
            if (existingUser) {
                res.status(409).json({
                    success: false,
                    message: 'An account with this email address already exists.',
                });
                return;
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            const passwordHash = await bcryptjs_1.default.hash(password, salt);
            const user = await User_js_1.User.create({
                name,
                email,
                passwordHash,
                role: 'learner',
                learningInterests: [],
            });
            const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), email: user.email, role: user.role }, env_js_1.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie('cp_token', token, {
                httpOnly: true,
                secure: env_js_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(201).json({
                success: true,
                message: 'Account created successfully.',
                data: {
                    token,
                    user: user.toJSON(),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User_js_1.User.findOne({ email });
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid email or password.',
                });
                return;
            }
            if (user.accountStatus === 'suspended') {
                res.status(403).json({
                    success: false,
                    message: 'This account has been suspended. Please contact support.',
                });
                return;
            }
            const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
            if (!isMatch) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid email or password.',
                });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), email: user.email, role: user.role }, env_js_1.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie('cp_token', token, {
                httpOnly: true,
                secure: env_js_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.json({
                success: true,
                message: 'Logged in successfully.',
                data: {
                    token,
                    user: user.toJSON(),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(req, res) {
        res.clearCookie('cp_token', {
            httpOnly: true,
            secure: env_js_1.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        res.json({
            success: true,
            message: 'Logged out successfully.',
        });
    }
    static async getMe(req, res) {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        res.json({
            success: true,
            data: req.user.toJSON(),
        });
    }
    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const user = await User_js_1.User.findOne({ email });
            // Always return success to prevent email enumeration
            if (!user) {
                res.json({
                    success: true,
                    message: 'If an account with that email exists, password reset instructions have been sent.',
                });
                return;
            }
            const rawToken = crypto_1.default.randomBytes(32).toString('hex');
            const tokenHash = crypto_1.default.createHash('sha256').update(rawToken).digest('hex');
            await PasswordResetToken_js_1.PasswordResetToken.create({
                user: user._id,
                tokenHash,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            });
            await emailService_js_1.EmailService.sendPasswordResetEmail(user.email, rawToken);
            res.json({
                success: true,
                message: 'If an account with that email exists, password reset instructions have been sent.',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            const tokenHash = crypto_1.default.createHash('sha256').update(token).digest('hex');
            const resetRecord = await PasswordResetToken_js_1.PasswordResetToken.findOne({
                tokenHash,
                used: false,
                expiresAt: { $gt: new Date() },
            });
            if (!resetRecord) {
                res.status(400).json({
                    success: false,
                    message: 'Password reset link is invalid or has expired. Please request a new one.',
                });
                return;
            }
            const user = await User_js_1.User.findById(resetRecord.user);
            if (!user) {
                res.status(400).json({
                    success: false,
                    message: 'User no longer exists.',
                });
                return;
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            user.passwordHash = await bcryptjs_1.default.hash(password, salt);
            await user.save();
            resetRecord.used = true;
            await resetRecord.save();
            res.json({
                success: true,
                message: 'Your password has been reset successfully. You can now log in.',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
