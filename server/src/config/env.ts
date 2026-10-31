import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/certipro'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters').default('certipro_default_jwt_secret_change_in_prod'),
  COOKIE_SECRET: z.string().default('certipro_default_cookie_secret_key'),
  ADMIN_BOOTSTRAP_EMAIL: z.string().email().default('admin@certipro.dev'),
  ADMIN_BOOTSTRAP_PASSWORD: z.string().min(8).default('Admin123!'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 587)),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().default('noreply@certipro.dev'),
  CODE_EXECUTION_PROVIDER_URL: z.string().optional(),
  CODE_EXECUTION_PROVIDER_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  throw new Error('Environment configuration error');
}

export const env = parsed.data;

