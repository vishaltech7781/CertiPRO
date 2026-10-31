"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('5000').transform((val) => parseInt(val, 10)),
    CLIENT_URL: zod_1.z.string().default('http://localhost:5173'),
    MONGODB_URI: zod_1.z.string().default('mongodb://127.0.0.1:27017/certipro'),
    JWT_SECRET: zod_1.z.string().min(16, 'JWT_SECRET must be at least 16 characters').default('certipro_default_jwt_secret_change_in_prod'),
    COOKIE_SECRET: zod_1.z.string().default('certipro_default_cookie_secret_key'),
    ADMIN_BOOTSTRAP_EMAIL: zod_1.z.string().email().default('admin@certipro.dev'),
    ADMIN_BOOTSTRAP_PASSWORD: zod_1.z.string().min(8).default('Admin123!'),
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.string().optional().transform((val) => (val ? parseInt(val, 10) : 587)),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASSWORD: zod_1.z.string().optional(),
    SMTP_FROM: zod_1.z.string().default('noreply@certipro.dev'),
    CODE_EXECUTION_PROVIDER_URL: zod_1.z.string().optional(),
    CODE_EXECUTION_PROVIDER_KEY: zod_1.z.string().optional(),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.format());
    throw new Error('Environment configuration error');
}
exports.env = parsed.data;
