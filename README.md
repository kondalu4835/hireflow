# HireFlow — AI-Powered Job Board

A full-stack job board built with Next.js 15, TypeScript, PostgreSQL, Prisma, and JWT Auth.

**Built by:** Mogili Yedukondalu  
**GitHub:** https://github.com/kondalu4835  
**LinkedIn:** https://linkedin.com/in/yedukondalu-mogili  

## Tech Stack
- **Frontend/Backend:** Next.js 15 (App Router), TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT (httpOnly cookies)
- **Styling:** Tailwind CSS + Custom Design System
- **Validation:** Zod

## Features
- ✅ Employer & Candidate roles
- ✅ Full CRUD for jobs (Create, Read, Update, Delete)
- ✅ Job applications with cover letters
- ✅ Application status management (Pending → Shortlisted → Hired)
- ✅ Search & filter jobs
- ✅ Secure JWT auth with httpOnly cookies
- ✅ Data validation with Zod
- ✅ Responsive dark UI

## Setup & Run

### 1. Clone & Install
```bash
git clone <your-repo>
cd jobboard
npm install
```

### 2. Setup Database
```bash
# Create PostgreSQL database named 'jobboard'
# Update .env with your DATABASE_URL
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Environment Variables
```bash
cp .env.example .env
# Fill in your values
```

### 4. Run
```bash
npm run dev
# Open http://localhost:3000
```

## Deployment (Vercel)
```bash
npm install -g vercel
vercel
# Add environment variables in Vercel dashboard
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current user |
| GET | /api/jobs | List all jobs |
| POST | /api/jobs | Create job (Employer) |
| GET | /api/jobs/:id | Get job details |
| PUT | /api/jobs/:id | Update job (Employer) |
| DELETE | /api/jobs/:id | Delete job (Employer) |
| GET | /api/applications | My applications |
| POST | /api/applications | Apply to job (Candidate) |
| PUT | /api/applications/:id | Update status (Employer) |
| DELETE | /api/applications/:id | Withdraw application |
