# TechFynite Backend API

![TechFynite](https://img.shields.io/badge/TechFynite-Backend-blue?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Modern **RESTful backend API** for a digital templates marketplace + content management platform.

Live: https://techfynite.vercel.app  
API Docs: https://techfynite.vercel.app/api-docs (if Swagger/ReDoc is set up)

## Features

### Authentication & Users
- Email + password + Google OAuth
- Email OTP verification
- JWT + refresh tokens
- Role-based access (User / Admin / Super Admin)
- Profile, avatar upload, password reset, soft delete

### E-commerce (Templates)
- Template catalog with categories
- LemonSqueezy payment integration + webhooks
- Order lifecycle + license types (single/extended)
- Download tracking & purchase analytics

### Content (Blog/CMS)
- Rich-text blog posts with categories & tags
- Likes, reviews (with admin replies)
- Reading time, view count, SEO-friendly slugs

### Support & Marketing
- Contact form + threaded replies
- Newsletter subscriptions
- Admin dashboard endpoints

### Security & Performance
- Rate limiting
- Zod validation
- XSS sanitization
- Helmet headers
- CORS protection
- Prisma ORM (prevents SQL injection)

## Tech Stack

| Layer              | Technology                     |
|--------------------|--------------------------------|
| Runtime            | Node.js + TypeScript           |
| Framework          | Express.js                     |
| ORM/Database       | Prisma + PostgreSQL            |
| Auth               | JWT, bcrypt, Google OAuth      |
| Validation         | Zod                            |
| Security           | Helmet, express-rate-limit, XSS sanitizer |
| File Storage       | Cloudinary                     |
| Payments           | LemonSqueezy                   |
| Email              | Nodemailer                     |
| Deployment         | Vercel                         |
| Logging            | Morgan                         |

## Project Structure
src/
├── config/          → env, db config
├── middleware/      → auth, rate-limit, upload
├── module/          → feature modules (auth, blog, template, order, contact, newsletter, webhook)
├── routes/          → Express route definitions
├── types/           → TypeScript shared types
└── utils/           → helpers, error handling, etc.


## API Endpoints Overview

**Base path:** `/api/v1`

| Group              | Main Endpoints                                   | Auth level     |
|--------------------|--------------------------------------------------|----------------|
| Auth               | `/auth/register`, `/login`, `/google-login`, `/verify-otp`, `/me`, `/profile` | Public + JWT   |
| Templates          | `/templates`, `/templates/:id`, `/templates/category/:id` | Public + Admin |
| Blogs              | `/blogs`, `/blogs/:id`, `/blogs/:id/like`        | Public + Admin |
| Orders             | `/orders`, `/orders/:id`, `/orders/user/:id`, `/orders/stats` | JWT + Admin    |
| Contacts           | `/contacts`, `/contacts/:id/reply`               | Public + Admin |
| Admin              | Various CRUD + stats endpoints                   | Admin only     |

Response format (consistent):

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { "page": 1, "limit": 10, "total": 42, "pages": 5 }  // when applicable
}

Quick Start
Bash# 1. Clone
git clone https://github.com/parvejme24/techfynite-backend.git
cd techfynite-backend

# 2. Install
npm install

# 3. Copy & configure .env
cp .env.example .env

# 4. Database
npx prisma generate
npx prisma db push    # or prisma migrate dev

# 5. Run
npm run dev

Deployment (Vercel)

Build: npm run vercel-build
Push to GitHub
Import repo in Vercel
Add environment variables in dashboard
Deploy

Portfolio Highlights

Full-featured e-commerce backend for digital products
Secure authentication with multi-provider login + OTP
Payment integration (LemonSqueezy + webhook handling)
Modern ORM (Prisma) + PostgreSQL schema design
Role-based authorization + comprehensive security layers
Production deployment on Vercel with real domain
Type-safe development with TypeScript & Zod

Built by Md Parvej
GitHub: https://github.com/parvejme24