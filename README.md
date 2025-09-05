# 🚀 TechFynite Backend API

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**A comprehensive TypeScript backend API powering a digital template marketplace with advanced e-commerce features**

[![Live Demo](https://img.shields.io/badge/Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://techfynite-backend.vercel.app)
[![API Documentation](https://img.shields.io/badge/API_Docs-FF6B6B?style=for-the-badge&logo=swagger&logoColor=white)](#api-endpoints)

</div>

---

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [📚 API Endpoints](#-api-endpoints)
- [🗄️ Database Schema](#️-database-schema)
- [🔐 Authentication & Security](#-authentication--security)
- [☁️ Deployment](#️-deployment)
- [📊 Performance & Monitoring](#-performance--monitoring)
- [🤝 Contributing](#-contributing)

---

## 🎯 Project Overview

**TechFynite Backend** is a robust, scalable TypeScript API that powers a modern **digital template marketplace**. This platform enables creators to sell digital products like website templates, UI kits, and design assets with comprehensive e-commerce functionality.

### 🎨 What Makes This Special?

- **🛒 Complete Digital Marketplace**: Full e-commerce platform for selling digital templates
- **💳 Advanced Payment Processing**: LemonSqueezy integration for secure transactions
- **📝 Content Marketing**: Integrated blog system for SEO and marketing
- **🔐 License Management**: Digital license validation and tracking system
- **📧 Customer Support**: Contact management and automated email responses
- **👥 Multi-role System**: USER, ADMIN, and SUPER_ADMIN with granular permissions
- **☁️ Cloud Storage**: Cloudinary integration for seamless file management
- **🔄 Real-time Features**: WebSocket support for live updates

---

## ✨ Key Features

### 🛒 Digital Template Marketplace
- **Template Management**: Upload, categorize, and manage digital templates
- **Category System**: Organized template categorization (Web, Mobile, UI/UX, etc.)
- **Pricing Plans**: Flexible pricing with single/extended licenses
- **Preview System**: Live preview links and screenshot galleries
- **Download Management**: Secure file delivery system
- **Sales Analytics**: Track downloads, purchases, and revenue

### 💳 E-commerce & Payment
- **Order Processing**: Complete order lifecycle with invoice generation
- **Payment Integration**: LemonSqueezy webhook handling for secure payments
- **License Management**: Digital license validation and tracking
- **Subscription Plans**: Flexible subscription management with feature access
- **Invoice Generation**: Automated invoice creation and delivery
- **Refund Handling**: Complete refund and cancellation system

### 📝 Content Marketing & SEO
- **Blog System**: Multi-paragraph blog posts with rich content
- **SEO Optimization**: Slug-based URLs, meta descriptions, and structured data
- **Review System**: Customer reviews with admin reply functionality
- **Like System**: User engagement through likes and views
- **Newsletter**: Email subscription management for marketing
- **Content Categories**: Organized content categorization

### 👥 User Management & Support
- **Authentication**: JWT-based auth with refresh tokens
- **Role-based Access**: Granular permission system
- **Profile Management**: User profiles with photo uploads
- **Contact System**: Customer inquiry management with replies
- **Notification System**: Real-time user notifications
- **Customer Support**: Ticket-based support system

---

## 🏗️ Architecture

```mermaid
graph TB
    A[Frontend Applications] --> B[API Gateway]
    B --> C[Authentication Layer]
    C --> D[Business Logic Layer]
    D --> E[Data Access Layer]
    E --> F[PostgreSQL Database]
    
    D --> G[Cloudinary Storage]
    D --> H[LemonSqueezy API]
    D --> I[Email Service]
    
    subgraph "Core Modules"
        J[Auth Module]
        K[User Module]
        L[Template Module]
        M[Blog Module]
        N[Order Module]
        O[Payment Module]
        P[Subscription Module]
        Q[License Module]
    end
    
    D --> J
    D --> K
    D --> L
    D --> M
    D --> N
    D --> O
    D --> P
    D --> Q
```

---

## 🛠️ Tech Stack

### 🎯 Core Technologies
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh token strategy
- **File Storage**: Cloudinary integration
- **Payment Processing**: LemonSqueezy API

### 🔧 Development Tools
- **Language**: TypeScript for type safety
- **ORM**: Prisma for database management
- **Validation**: Zod for request validation
- **Security**: Helmet, CORS, Rate limiting
- **Monitoring**: Morgan for request logging
- **Development**: Nodemon for hot reloading

### ☁️ Deployment & Infrastructure
- **Hosting**: Vercel for serverless deployment
- **Database**: PostgreSQL (production)
- **CDN**: Cloudinary for asset delivery
- **Environment**: Environment-based configuration

---

## 📁 Project Structure

```
tf_b_ts/
├── 📁 src/
│   ├── 📁 config/           # Database and service configurations
│   │   ├── database.ts      # Prisma client setup
│   │   └── cloudinary.ts    # Cloudinary configuration
│   ├── 📁 middlewares/      # Custom middleware functions
│   │   ├── auth.ts          # Authentication middleware
│   │   └── cloudinary-upload.ts # File upload handling
│   ├── 📁 modules/          # Feature-based modules
│   │   ├── 📁 auth/         # Authentication & authorization
│   │   ├── 📁 user/         # User management
│   │   ├── 📁 template/     # Template marketplace
│   │   ├── 📁 templateCategory/ # Template categorization
│   │   ├── 📁 blog/         # Blog system
│   │   ├── 📁 blogCategory/ # Blog categorization
│   │   ├── 📁 blogReview/   # Blog review system
│   │   ├── 📁 order/        # Order processing
│   │   ├── 📁 payment/      # Payment handling
│   │   ├── 📁 subscription/ # Subscription management
│   │   ├── 📁 license/      # License management
│   │   ├── 📁 contact/      # Contact management
│   │   ├── 📁 newsletter/   # Email subscriptions
│   │   ├── 📁 notification/ # User notifications
│   │   ├── 📁 pricing/      # Pricing plans
│   │   ├── 📁 checkout/     # Checkout process
│   │   └── 📁 webhook/      # Third-party webhooks
│   ├── 📁 types/            # TypeScript type definitions
│   ├── app.ts               # Express app configuration
│   └── server.ts            # Server entry point
├── 📁 prisma/               # Database schema and migrations
│   ├── schema.prisma        # Database schema definition
│   └── 📁 migrations/       # Database migration files
├── 📁 uploads/              # Local file storage (development)
├── 📁 dist/                 # Compiled JavaScript output
├── package.json             # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vercel.json             # Vercel deployment config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Cloudinary account
- LemonSqueezy account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tf_b_ts.git
   cd tf_b_ts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/techfynite"
   JWT_SECRET="your-jwt-secret"
   JWT_REFRESH_SECRET="your-refresh-secret"
   CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
   CLOUDINARY_API_KEY="your-cloudinary-key"
   CLOUDINARY_API_SECRET="your-cloudinary-secret"
   LEMONSQUEEZY_API_KEY="your-lemonsqueezy-key"
   LEMONSQUEEZY_STORE_ID="your-store-id"
   ```

4. **Database Setup**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

---

## 📚 API Endpoints

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | User registration | ❌ |
| POST | `/login` | User login | ❌ |
| POST | `/refresh-token` | Refresh JWT token | ❌ |
| POST | `/logout` | User logout | ✅ |
| GET | `/profile` | Get user profile | ✅ |
| PUT | `/profile` | Update user profile | ✅ |
| POST | `/upload-photo` | Upload profile photo | ✅ |

### 🛒 Template Marketplace (`/api/v1/templates`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/templates` | Get all templates | ❌ |
| GET | `/templates/:id` | Get template by ID | ❌ |
| GET | `/templates/category/:categoryId` | Get templates by category | ❌ |
| POST | `/templates` | Create template | Admin+ |
| PUT | `/templates/:id` | Update template | Admin+ |
| DELETE | `/templates/:id` | Delete template | Admin+ |
| POST | `/templates/:id/download` | Download template | ✅ |

### 📝 Blog System (`/api/v1/blogs`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/blogs` | Get all blogs | ❌ |
| GET | `/blogs/:id` | Get blog by ID | ❌ |
| GET | `/blogs/search` | Search blogs | ❌ |
| POST | `/blogs` | Create blog | Admin+ |
| PUT | `/blogs/:id` | Update blog | Admin+ |
| DELETE | `/blogs/:id` | Delete blog | Admin+ |
| POST | `/blogs/:id/like` | Like blog | ✅ |

### 💳 Orders & Payments (`/api/v1/orders`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/orders` | Get user orders | ✅ |
| GET | `/orders/:id` | Get order by ID | ✅ |
| POST | `/orders` | Create order | ✅ |
| PUT | `/orders/:id/status` | Update order status | Admin+ |

### 🔑 License Management (`/api/v1/licenses`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/licenses` | Get user licenses | ✅ |
| GET | `/licenses/:id` | Get license by ID | ✅ |
| POST | `/licenses/validate` | Validate license key | ❌ |

### 📧 Contact & Support (`/api/v1/contacts`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/contacts` | Submit contact form | ❌ |
| GET | `/contacts` | Get all contacts | Admin+ |
| PUT | `/contacts/:id/status` | Update contact status | Admin+ |
| POST | `/contacts/:id/reply` | Reply to contact | Admin+ |

---

## 🗄️ Database Schema

### Core E-commerce Entities

#### 🛒 Template Model
```typescript
model Template {
  id                    String   @id @default(uuid())
  title                 String
  slug                  String   @unique
  price                 Float
  lemonsqueezyProductId String? // LemonSqueezy integration
  lemonsqueezyVariantId String? // License type (Single/Extended)
  imageUrl              String?
  screenshots           String[] // Preview gallery
  previewLink           String? // Live preview
  sourceFiles           String[] // Downloadable files
  shortDescription      String
  description           String[] // Full details
  whatsIncluded         String[]
  keyFeatures           Json[] // Feature highlights
  version               Float
  pages                 Int      @default(1)
  downloads             Int      @default(0)
  totalPurchase         Int      @default(0)
  categoryId            String
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  // Relations...
}
```

#### 💳 Order Invoice Model
```typescript
model OrderInvoice {
  id                String         @id @default(uuid())
  orderId           String         @unique // LemonSqueezy Order ID
  licenseKey        String? // Generated license
  userId            String
  templateId        String
  templateName      String
  templateThumbnail String?
  templatePrice     Float
  totalPrice        Float
  paymentMethod     PaymentMethod
  paymentStatus     PaymentStatus  @default(PENDING)
  transactionId     String?
  status            OrderStatus    @default(PENDING)
  deliveryMethod    DeliveryMethod
  deliveryUrl       String? // Download link
  invoiceNumber     String         @unique
  invoiceDate       DateTime
  userEmail         String
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  // Relations...
}
```

#### 🔑 License Model
```typescript
model License {
  id         String    @id @default(uuid())
  licenseKey String    @unique // LemonSqueezy License Key
  templateId String
  userId     String
  orderId    String    @unique
  isValid    Boolean   @default(true)
  expiresAt  DateTime?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  // Relations...
}
```

---

## 🔐 Authentication & Security

### 🔑 JWT Authentication
- **Access Tokens**: Short-lived (15 minutes) for API access
- **Refresh Tokens**: Long-lived (7 days) for token renewal
- **Secure Storage**: HTTP-only cookies for refresh tokens

### 🛡️ Security Features
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: API request throttling
- **CORS Protection**: Configured origins
- **Helmet**: Security headers
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM

### 👥 Role-based Access Control
```typescript
enum UserRole {
  USER         // Customer access
  ADMIN        // Content management
  SUPER_ADMIN  // Full system access
}
```

---

## ☁️ Deployment

### 🚀 Vercel Deployment
The application is configured for seamless deployment on Vercel:

```bash
# Deploy to production
npm run deploy

# Development deployment
npm run vercel-dev
```

### 🔧 Environment Configuration
- **Production**: PostgreSQL database with connection pooling
- **Development**: Local PostgreSQL with Prisma Studio
- **Staging**: Vercel preview deployments

### 📊 Monitoring & Logging
- **Request Logging**: Morgan middleware
- **Error Tracking**: Comprehensive error handling
- **Health Checks**: `/health` endpoint for monitoring
- **Database Logging**: Prisma query logging in development

---

## 📊 Performance & Monitoring

### ⚡ Performance Optimizations
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Prisma connection management
- **File Upload**: Cloudinary CDN for fast asset delivery
- **Caching**: Strategic caching for frequently accessed data

### 📈 Monitoring Features
- **Health Endpoint**: Server status monitoring
- **Request Logging**: Detailed API request logs
- **Error Tracking**: Comprehensive error logging
- **Database Metrics**: Query performance monitoring

---

## 🤝 Contributing

### 🛠️ Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📝 Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages

---

## 📞 Contact & Support

<div align="center">

**Built with ❤️ for the TechFynite Digital Marketplace**

[![Portfolio](https://img.shields.io/badge/Portfolio-FF6B6B?style=for-the-badge&logo=firefox&logoColor=white)](https://yourportfolio.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourprofile)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your.email@example.com)

</div>

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

*This project demonstrates advanced TypeScript backend development for digital marketplaces with modern e-commerce best practices, comprehensive API design, and production-ready architecture.*

</div>
