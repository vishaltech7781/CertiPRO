# CertiPro — Complete Online Learning & Course Certification Platform

> **"Learn with purpose. Prove your skills."**

CertiPro is a full-stack, production-quality MERN online learning and verifiable course certification platform inspired by the discovery and learning experiences of Coursera and Udemy. It provides structured video curricula, theory examinations, hands-on algorithmic coding challenges with deterministic sandboxed evaluation, persistent progress tracking, and cryptographically verifiable PDF certificate generation.

---

## 1. Key Features

- **Course Discovery & Advanced Filtering:** Full-text server-side search, multi-facet filtering (Category, Skill Level, Course Track, Free/Paid status), sorting (Most Popular, Newest, Rating), and active filter chip management.
- **Rich 18+ Seed Curricula:** Seeded with 18 comprehensive, realistic courses spanning Artificial Intelligence, Machine Learning, Cloud Architecture, Full-Stack MERN, React 18, Node.js Microservices, Python, Java, Data Science, Advanced SQL, Cybersecurity, DevOps, Git, DSA, Computer Networks, Operating Systems, Software Architecture, and Technical Interview Prep.
- **Video Lesson Player:** Seamless educational video integration using privacy-enhanced YouTube lecture embeds (`youtube-nocookie.com`) with graceful external lecture fallbacks.
- **Persistent Progress Tracking:** Lesson completion is tracked in MongoDB, updating course progress percentages dynamically across devices.
- **Theory Quizzes:** Server-side answer validation, weighted scoring, pass/fail thresholds, multiple attempts, and answer explanations revealed only upon submission.
- **Hands-on Coding Challenges:** In-browser code workspace supporting JavaScript, Python, and SQL with sample test execution and full submission evaluations against test suites.
- **Verifiable PDF Certificates:** Vector-drawn, print-ready landscape PDF certificates generated with PDFKit featuring unique Certificate IDs, verification codes, and a public verification URL.
- **Public Credential Registry:** Anyone can verify the authenticity of a certificate at `/certificate/verify/:verificationCode` without exposing private account details.
- **Learner Dashboard & Profile:** Real database metrics tracking in-progress courses, completed courses, earned certificates, and milestone event timelines.
- **Administrator Portal:** Role-based access control (RBAC) protecting course management, curriculum authoring (modules and lessons), taxonomy categories, user accounts, and platform analytics.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Bundler & Tooling:** Vite, PostCSS, Autoprefixer
- **Routing:** React Router v6
- **State Management & Caching:** TanStack Query (React Query v5)
- **Styling:** Tailwind CSS with custom editorial educational design tokens
- **Icons:** Lucide React
- **Testing:** Vitest, React Testing Library, JSDOM

### Backend
- **Runtime:** Node.js v20+ / v22+
- **Framework:** Express.js with TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT tokens via HTTP-only cookies and Authorization Bearer headers
- **Validation:** Zod schemas
- **Security:** Helmet, CORS with origin control, bcryptjs, express-rate-limit
- **Document Generation:** PDFKit vector rendering
- **Testing:** Vitest, Supertest

---

## 3. Project Structure

```
CertiPRO/
├── package.json              # Root orchestration scripts
├── .env.example              # Environment variables template
├── .gitignore
├── README.md                 # System documentation
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── src/
│   │   ├── app.ts            # Express application setup & middleware
│   │   ├── server.ts         # Server bootstrap & graceful shutdown
│   │   ├── config/           # Database connection & validated env config
│   │   ├── models/           # Mongoose schemas (User, Course, Lesson, Quiz, Coding, Certificate...)
│   │   ├── validators/       # Zod request body & query schemas
│   │   ├── middleware/       # Auth, RBAC, Validation, Rate Limiters, Error Handling
│   │   ├── controllers/      # Route controllers for all domains
│   │   ├── services/         # PDFKit certificate service, code evaluation, email
│   │   ├── routes/           # REST endpoints (/auth, /courses, /me, /quizzes, /admin...)
│   │   ├── seed/             # Repeatable seed script (18 comprehensive courses)
│   │   └── tests/            # Supertest & Vitest API integration tests
└── client/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.tsx          # React DOM root & Providers
        ├── App.tsx           # Route definitions
        ├── context/          # AuthContext & token management
        ├── lib/              # Centralized typed API client
        ├── types/            # Shared TypeScript interfaces
        ├── components/
        │   ├── layout/       # Navbar, Footer, AppShell, AdminShell
        │   ├── ui/           # Button, Badge, Input, Alert, EmptyState, Breadcrumbs
        │   ├── courses/      # CourseCard, CourseFilters
        │   ├── learning/     # VideoPlayer, LessonCurriculum
        │   └── assessments/  # QuizRunner, CodeEditorRunner
        ├── pages/            # Public, Learner, and Admin pages
        └── test/             # React Testing Library component tests
```

---

## 4. Prerequisites

1. **Node.js**: v18.0.0 or higher (v22.x recommended).
2. **npm**: v9.0.0 or higher.
3. **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI.

---

## 5. Quick Start Instructions

### 1. Install Dependencies
Run the installation command from the repository root:
```bash
npm run install:all
```
*(Or install in each directory: `npm install`, `cd server && npm install`, `cd client && npm install`)*

### 2. Configure Environment Variables
Copy `.env.example` in both root and `server/`:
```bash
cp .env.example server/.env
```
Ensure your MongoDB URI points to your running instance:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/certipro
JWT_SECRET=certipro_secure_jwt_secret_dev_key_2026_x89f_learn_with_purpose
COOKIE_SECRET=certipro_cookie_secret_dev_key_2026_q32m
```

### 3. Seed Database
Seed 18+ rich courses, theory quizzes, coding challenges, categories, and pre-configured demo learner and administrator accounts:
```bash
npm run seed
```

### 4. Start Development Servers
Run frontend and backend simultaneously:
```bash
npm run dev
```
- Client runs on: `http://localhost:5173`
- Backend API runs on: `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/v1/health`

---

## 6. Demo Accounts & Credentials

The seed script creates two fully functional accounts:

| Role | Email | Password | Pre-populated Data |
| :--- | :--- | :--- | :--- |
| **Learner** | `learner@certipro.dev` | `Learner123!` | Enrolled in 3 courses; Full-Stack MERN 100% completed with an authentic, downloadable certificate |
| **Admin** | `admin@certipro.dev` | `Admin123!` | Full access to `/admin` portal (Course authoring, Curriculum editor, Taxonomy, Users, Analytics) |

### Sample Authentic Certificate for Testing
- **Certificate ID:** `CP-2026-F98A2C71`
- **Verification Code:** `VRF-7D2F8A1E90`
- **Public Verification URL:** `http://localhost:5173/certificate/verify/VRF-7D2F8A1E90`

---

## 7. Testing & Build Commands

### Run All Automated Tests
```bash
npm test
```
- Backend tests execute 13 test suites validating authentication, course filtering, enrollment idempotency, quiz scoring, PDF streaming, and RBAC security.
- Frontend tests validate button states, course card metadata rendering, and progress bars.

### Typecheck & Lint
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

---

## 8. API Overview

All backend endpoints are prefixed with `/api/v1`.

### Authentication
- `POST /auth/register` — Register a new learner account
- `POST /auth/login` — Sign in and receive JWT token + session cookie
- `POST /auth/logout` — Clear session
- `GET /auth/me` — Retrieve current authenticated session
- `POST /auth/forgot-password` — Dispatch reset token link (simulated in development)
- `POST /auth/reset-password` — Set new password using token

### Courses & Catalog
- `GET /courses` — Filtered catalog (supports `q`, `category`, `skillLevel`, `courseType`, `isFree`, `sort`, `page`, `limit`)
- `GET /courses/trending` — Top trending courses
- `GET /courses/recent` — Recently published courses
- `GET /courses/:slug` — Full course details, lessons, and assessment metadata
- `GET /courses/:courseId/curriculum` — Full course curriculum with modules and lessons
- `GET /categories` — All categories with dynamic course counts
- `GET /categories/:slug` — Category listing with courses

### Learning & Enrollments
- `POST /courses/:courseId/enroll` — Enroll in a course (prevents duplicates)
- `GET /me/enrollments` — Retrieve user's enrolled courses with progress
- `POST /courses/:courseId/lessons/:lessonId/complete` — Record lesson completion and recalculate progress
- `GET /courses/:courseId/progress` — Get user progress and completed lesson IDs

### Assessments
- `GET /quizzes/course/:courseId` — Course quizzes (answers stripped)
- `GET /quizzes/:quizId` — Quiz details (answers stripped)
- `POST /quizzes/:quizId/submit` — Submit quiz answers; backend grading and explanations
- `GET /challenges/course/:courseId` — Coding challenges (hidden tests stripped)
- `GET /challenges/:challengeId` — Coding challenge details
- `POST /challenges/:challengeId/run` — Run code against sample tests
- `POST /challenges/:challengeId/submit` — Submit code against full test suite

### Certificates
- `POST /courses/:courseId/certificate` — Claim certificate (enforces backend eligibility criteria)
- `GET /me/certificates` — Retrieve learner's earned certificates
- `GET /certificates/:certificateId` — Retrieve certificate metadata
- `GET /certificates/:certificateId/download` — Stream vector PDF certificate
- `GET /certificates/verify/:verificationCode` — Public authentication endpoint

### Administration (Requires Admin Role)
- `GET /admin/analytics` — Real-time platform metrics
- `GET /admin/courses` — Course table with publish toggles
- `POST /admin/courses` — Create new course
- `PUT /admin/courses/:courseId` — Edit course
- `POST /admin/courses/:courseId/modules` — Add curriculum module
- `POST /admin/courses/:courseId/lessons` — Add lesson with YouTube ID
- `GET /admin/users` — User list and role toggles
- `GET /admin/categories` — Category manager

---

## 9. Security & Privacy Safeguards

- **Password Hashing:** Passwords hashed with bcrypt using 10 salt rounds.
- **RBAC Security:** Administrative endpoints protected by server-side role checks (`requireAdmin`).
- **Input Validation:** All incoming requests parsed and validated via Zod schemas.
- **Secure Video Embedding:** YouTube videos embedded via privacy-preserving `youtube-nocookie.com` with iframe sandboxing.
- **NoSQL Injection & XSS Protection:** Mongoose schema constraints, Helmet headers, and disabled raw HTML rendering.
- **Clean Public Verification:** Certificate verification reveals only student name, course title, and completion date. Email addresses, passwords, and account records are never disclosed.
- **Account Deactivation:** Complies with privacy requirements by sanitizing personal identifiable data while keeping cryptographic hashes for historic certificates intact.

---

## 10. Deployment Guidance

### Deploying the Backend
1. Deploy to any Node-compatible host (Render, Railway, Fly.io, Heroku, AWS ECS).
2. Set environment variables: `NODE_ENV=production`, `PORT=5000`, `CLIENT_URL=https://your-domain.com`, `MONGODB_URI=mongodb+srv://...`, `JWT_SECRET=...`, `COOKIE_SECRET=...`.
3. Start command: `npm run start --prefix server` (runs `node dist/server.js`).

### Deploying the Frontend
1. Deploy the `client` directory to Vercel, Netlify, or Cloudflare Pages.
2. Build command: `npm run build --prefix client`.
3. Output directory: `client/dist`.
4. Configure SPA rewrite fallback to `index.html` for client-side routing.

---

## 11. Design System & Anti-Pattern Compliance

CertiPro adheres to an editorial, education-focused aesthetic:
- **Palette:** Deep ink navy (`#0B132B`, `#1C2541`), warm neutral reading surfaces (`#F8FAFC`, `#F1F5F9`), restrained brand blue (`#2563EB`), muted teal (`#0D9488`), and success emerald (`#16A34A`).
- **Typography:** `Source Sans 3` and clean system fallbacks with clear hierarchy.
- **Reviewed Against all 30 Anti-Patterns:** No harsh gradients, no purple/black SaaS templates, no emojis as UI icons, no fake testimonials or invented counts, no generic pill buttons, and no decorative radial orbs.

