import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { connectDB, disconnectDB } from '../config/db.js';

describe('CertiPro API Test Suite', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('Health Check', () => {
    it('GET /api/v1/health should return ok status', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('CertiPro API');
    });
  });

  describe('Courses Catalog & Filtering', () => {
    it('GET /api/v1/courses should return published courses list', async () => {
      const res = await request(app).get('/api/v1/courses');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.pagination).toBeDefined();
    });

    it('GET /api/v1/courses?q=React should filter by search term', async () => {
      const res = await request(app).get('/api/v1/courses?q=React');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const allContainReact = res.body.data.some((c: any) =>
        c.title.toLowerCase().includes('react') || c.skills.some((s: string) => s.toLowerCase().includes('react'))
      );
      expect(allContainReact).toBe(true);
    });

    it('GET /api/v1/courses/:slug should return course detail', async () => {
      const res = await request(app).get('/api/v1/courses/modern-full-stack-engineering-with-mern');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('modern-full-stack-engineering-with-mern');
      expect(res.body.data.modules).toBeDefined();
      expect(res.body.data.lessons).toBeDefined();
    });

    it('GET /api/v1/categories should return categories with dynamic course counts', async () => {
      const res = await request(app).get('/api/v1/categories');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].courseCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Authentication Workflow', () => {
    const testEmail = `test_${Date.now()}@certipro.dev`;
    const testPassword = 'Password123!';

    it('POST /api/v1/auth/register should create a learner account', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Unit Test Learner',
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword,
        termsAccepted: true,
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(testEmail);
      expect(res.body.data.user.role).toBe('learner');
    });

    it('POST /api/v1/auth/register should reject duplicate email', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Duplicate Learner',
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword,
        termsAccepted: true,
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/v1/auth/login should authenticate valid credentials', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: testEmail,
        password: testPassword,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('POST /api/v1/auth/login should reject invalid password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: testEmail,
        password: 'WrongPassword123!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Certificates & Public Verification', () => {
    it('GET /api/v1/certificates/verify/:code should verify seeded authentic certificate', async () => {
      const res = await request(app).get('/api/v1/certificates/verify/VRF-7D2F8A1E90');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isValid).toBe(true);
      expect(res.body.data.certificateId).toBe('CP-2026-F98A2C71');
      expect(res.body.data.learnerName).toBe('Alex Mercer');
      // Ensure private user data is not exposed
      expect(res.body.data.email).toBeUndefined();
      expect(res.body.data.password).toBeUndefined();
    });

    it('GET /api/v1/certificates/:id/download should stream PDF buffer', async () => {
      const res = await request(app).get('/api/v1/certificates/CP-2026-F98A2C71/download');
      expect(res.status).toBe(200);
      expect(res.header['content-type']).toBe('application/pdf');
      expect(res.body).toBeDefined();
    });
  });

  describe('Role-Based Access Control (RBAC)', () => {
    it('GET /api/v1/admin/analytics should reject unauthorized learners', async () => {
      // Login as learner
      const loginRes = await request(app).post('/api/v1/auth/login').send({
        email: 'learner@certipro.dev',
        password: 'Learner123!',
      });

      const token = loginRes.body.data.token;

      const adminRes = await request(app)
        .get('/api/v1/admin/analytics')
        .set('Authorization', `Bearer ${token}`);

      expect(adminRes.status).toBe(403);
      expect(adminRes.body.message).toContain('Administrator');
    });

    it('GET /api/v1/admin/analytics should permit administrator', async () => {
      // Login as admin
      const loginRes = await request(app).post('/api/v1/auth/login').send({
        email: 'admin@certipro.dev',
        password: 'Admin123!',
      });

      const token = loginRes.body.data.token;

      const adminRes = await request(app)
        .get('/api/v1/admin/analytics')
        .set('Authorization', `Bearer ${token}`);

      expect(adminRes.status).toBe(200);
      expect(adminRes.body.success).toBe(true);
      expect(adminRes.body.data.totalCourses).toBeGreaterThan(0);
    });
  });
});

