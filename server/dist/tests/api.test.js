"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_js_1 = __importDefault(require("../app.js"));
const db_js_1 = require("../config/db.js");
(0, vitest_1.describe)('CertiPro API Test Suite', () => {
    (0, vitest_1.beforeAll)(async () => {
        await (0, db_js_1.connectDB)();
    });
    (0, vitest_1.afterAll)(async () => {
        await (0, db_js_1.disconnectDB)();
    });
    (0, vitest_1.describe)('Health Check', () => {
        (0, vitest_1.it)('GET /api/v1/health should return ok status', async () => {
            const res = await (0, supertest_1.default)(app_js_1.default).get('/api/v1/health');
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.status).toBe('ok');
            (0, vitest_1.expect)(res.body.service).toBe('CertiPro API');
        });
    });
    (0, vitest_1.describe)('Courses Catalog & Filtering', () => {
        (0, vitest_1.it)('GET /api/v1/courses should return published courses list', async () => {
            const res = await (0, supertest_1.default)(app_js_1.default).get('/api/v1/courses');
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.success).toBe(true);
            (0, vitest_1.expect)(Array.isArray(res.body.data)).toBe(true);
            (0, vitest_1.expect)(res.body.data.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(res.body.pagination).toBeDefined();
        });
        (0, vitest_1.it)('GET /api/v1/courses?q=React should filter by search term', async () => {
            const res = await (0, supertest_1.default)(app_js_1.default).get('/api/v1/courses?q=React');
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.success).toBe(true);
            const allContainReact = res.body.data.some((c) => c.title.toLowerCase().includes('react') || c.skills.some((s) => s.toLowerCase().includes('react')));
            (0, vitest_1.expect)(allContainReact).toBe(true);
        });
        (0, vitest_1.it)('GET /api/v1/courses/:slug should return course detail', async () => {
            const res = await (0, supertest_1.default)(app_js_1.default).get('/api/v1/courses/modern-full-stack-engineering-with-mern');
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.success).toBe(true);
            (0, vitest_1.expect)(res.body.data.slug).toBe('modern-full-stack-engineering-with-mern');
            (0, vitest_1.expect)(res.body.data.modules).toBeDefined();
            (0, vitest_1.expect)(res.body.data.lessons).toBeDefined();
        });
        (0, vitest_1.it)('GET /api/v1/categories should return categories with dynamic course counts', async () => {
            const res = await (0, supertest_1.default)(app_js_1.default).get('/api/v1/categories');
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.success).toBe(true);
            (0, vitest_1.expect)(res.body.data.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(res.body.data[0].courseCount).toBeGreaterThanOrEqual(0);
        });
    });
    (0, vitest_1.describe)('Authentication Workflow', () => {
        const testEmail = `test_${Date.now()}@certipro.dev`;
        const testPassword = 'Password123!';
        (0, vitest_1.it)('POST /api/v1/auth/register should create a learner account', async () => {
            const res = await (0, supertest_1.default)(app_js_1.default).post('/api/v1/auth/register').send({
                name: 'Unit Test Learner',
                email: testEmail,
                password: testPassword,
                confirmPassword: testPassword,
                termsAccepted: true,
            });
            (0, vitest_1.expect)(res.status).toBe(201);
            (0, vitest_1.expect)(res.body.success).toBe(true);
            (0, vitest_1.expect)(res.body.data.token).toBeDefined();
            (0, vitest_1.expect)(res.body.data.user.email).toBe(testEmail);
            (0, vitest_1.expect)(res.body.data.user.role).toBe('learner');
        });
        (0, vitest_1.it)('POST /api/v1/auth/register should reject duplicate email', async () => {
            const res = await (0, supertest_1.default)(app_js_1.default).post('/api/v1/auth/register').send({
                name: 'Duplicate Learner',
                email: testEmail,
                password: testPassword,
                confirmPassword: testPassword,
                termsAccepted: true,
            });
            (0, vitest_1.expect)(res.status).toBe(409);
            (0, vitest_1.expect)(res.body.success).toBe(false);
        });
        (0, vitest_1.it)('POST /api/v1/auth/login should authenticate valid credentials', async () => {
            const res = await (0, supertest_1.default)(app_js_1.default).post('/api/v1/auth/login').send({
                email: testEmail,
                password: testPassword,
            });
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.success).toBe(true);
            (0, vitest_1.expect)(res.body.data.token).toBeDefined();
        });
        (0, vitest_1.it)('POST /api/v1/auth/login should reject invalid password', async () => {
            const res = await (0, supertest_1.default)(app_js_1.default).post('/api/v1/auth/login').send({
                email: testEmail,
                password: 'WrongPassword123!',
            });
            (0, vitest_1.expect)(res.status).toBe(401);
            (0, vitest_1.expect)(res.body.success).toBe(false);
        });
    });
    (0, vitest_1.describe)('Certificates & Public Verification', () => {
        (0, vitest_1.it)('GET /api/v1/certificates/verify/:code should verify seeded authentic certificate', async () => {
            const res = await (0, supertest_1.default)(app_js_1.default).get('/api/v1/certificates/verify/VRF-7D2F8A1E90');
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.success).toBe(true);
            (0, vitest_1.expect)(res.body.isValid).toBe(true);
            (0, vitest_1.expect)(res.body.data.certificateId).toBe('CP-2026-F98A2C71');
            (0, vitest_1.expect)(res.body.data.learnerName).toBe('Alex Mercer');
            // Ensure private user data is not exposed
            (0, vitest_1.expect)(res.body.data.email).toBeUndefined();
            (0, vitest_1.expect)(res.body.data.password).toBeUndefined();
        });
        (0, vitest_1.it)('GET /api/v1/certificates/:id/download should stream PDF buffer', async () => {
            const res = await (0, supertest_1.default)(app_js_1.default).get('/api/v1/certificates/CP-2026-F98A2C71/download');
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.header['content-type']).toBe('application/pdf');
            (0, vitest_1.expect)(res.body).toBeDefined();
        });
    });
    (0, vitest_1.describe)('Role-Based Access Control (RBAC)', () => {
        (0, vitest_1.it)('GET /api/v1/admin/analytics should reject unauthorized learners', async () => {
            // Login as learner
            const loginRes = await (0, supertest_1.default)(app_js_1.default).post('/api/v1/auth/login').send({
                email: 'learner@certipro.dev',
                password: 'Learner123!',
            });
            const token = loginRes.body.data.token;
            const adminRes = await (0, supertest_1.default)(app_js_1.default)
                .get('/api/v1/admin/analytics')
                .set('Authorization', `Bearer ${token}`);
            (0, vitest_1.expect)(adminRes.status).toBe(403);
            (0, vitest_1.expect)(adminRes.body.message).toContain('Administrator');
        });
        (0, vitest_1.it)('GET /api/v1/admin/analytics should permit administrator', async () => {
            // Login as admin
            const loginRes = await (0, supertest_1.default)(app_js_1.default).post('/api/v1/auth/login').send({
                email: 'admin@certipro.dev',
                password: 'Admin123!',
            });
            const token = loginRes.body.data.token;
            const adminRes = await (0, supertest_1.default)(app_js_1.default)
                .get('/api/v1/admin/analytics')
                .set('Authorization', `Bearer ${token}`);
            (0, vitest_1.expect)(adminRes.status).toBe(200);
            (0, vitest_1.expect)(adminRes.body.success).toBe(true);
            (0, vitest_1.expect)(adminRes.body.data.totalCourses).toBeGreaterThan(0);
        });
    });
});
