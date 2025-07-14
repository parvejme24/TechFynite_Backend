# Style Zone Backend

This is the backend server for the Style Zone project, built with TypeScript, Express, and Prisma ORM.

## Features
- Express.js REST API
- Prisma ORM for database access
- TypeScript for type safety
- Security middleware (helmet, cors, rate limiting)
- Environment variable support with dotenv
- Nodemon and ts-node for development

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm
- A PostgreSQL database (or update the Prisma schema for your DB)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/parvejme24/style-zone-server.git
   cd style-zone-server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Copy `.env.example` to `.env` and fill in your database connection string and other variables.

4. Set up the database:
   - Edit `prisma/schema.prisma` if needed.
   - Run Prisma migrations and generate the client:
     ```bash
     npx prisma migrate dev --name init
     npx prisma generate
     ```

### Running the Server
- For development (with hot reload):
  ```bash
  npm run dev
  ```
- For production:
  ```bash
  npm run build
  npm start
  ```

The server will start on the port specified in your `.env` file (default: 5000).

## API Endpoints
- `GET /` — Home route (welcome message)
- `GET /health` — Health check

## Project Structure
```
tf_b_ts/
├── API_DOCS.md
├── docs/
│   ├── auth.md
│   ├── blog-category.md
│   ├── blog.md
│   ├── chat.md
│   ├── discount.md
│   ├── newsletter.md
│   ├── notification.md
│   ├── order.md
│   ├── product.md
│   ├── review.md
│   ├── sizeGuide.md
│   └── user.md
├── generated/
├── nodemon.json
├── package.json
├── prisma/
│   ├── migrations/
│   │   ├── 20250628214131_add_all_model/
│   │   │   └── migration.sql
│   │   ├── 20250630083812_add_otp_and_verification_to_user/
│   │   │   └── migration.sql
│   │   ├── 20250701201121_add_sper_admin_user_role/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── property.ts
├── README.md
├── src/
│   ├── app.ts
│   ├── config/
│   │   └── database.ts
│   ├── generated/
│   ├── middlewares/
│   │   └── auth.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.model.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.types.ts
│   │   │   ├── auth.utils.ts
│   │   │   └── index.ts
│   │   ├── blog/
│   │   │   ├── blog.controller.ts
│   │   │   ├── blog.model.ts
│   │   │   ├── blog.routes.ts
│   │   │   ├── blog.service.ts
│   │   │   ├── blog.types.ts
│   │   │   └── index.ts
│   │   ├── blogCategory/
│   │   │   ├── blogCategory.controller.ts
│   │   │   ├── blogCategory.model.ts
│   │   │   ├── blogCategory.routes.ts
│   │   │   ├── blogCategory.service.ts
│   │   │   ├── blogCategory.types.ts
│   │   │   └── index.ts
│   │   ├── blogReview/
│   │   │   ├── blogReview.controller.ts
│   │   │   ├── blogReview.middleware.ts
│   │   │   ├── blogReview.model.ts
│   │   │   ├── blogReview.routes.ts
│   │   │   ├── blogReview.service.ts
│   │   │   ├── blogReview.types.ts
│   │   │   └── index.ts
│   │   ├── notification/
│   │   │   ├── index.ts
│   │   │   ├── notification.controller.ts
│   │   │   ├── notification.model.ts
│   │   │   ├── notification.routes.ts
│   │   │   ├── notification.service.ts
│   │   │   └── notification.types.ts
│   │   ├── order/
│   │   │   ├── index.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── order.model.ts
│   │   │   ├── order.routes.ts
│   │   │   ├── order.service.ts
│   │   │   └── order.types.ts
│   │   ├── payment/
│   │   │   ├── fastspring.webhook.ts
│   │   │   ├── index.ts
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.routes.ts
│   │   │   └── payment.service.ts
│   │   ├── template/
│   │   │   ├── index.ts
│   │   │   ├── template.controller.ts
│   │   │   ├── template.model.ts
│   │   │   ├── template.routes.ts
│   │   │   ├── template.service.ts
│   │   │   └── template.types.ts
│   │   ├── templateCategory/
│   │   │   ├── index.ts
│   │   │   ├── templateCategory.controller.ts
│   │   │   ├── templateCategory.model.ts
│   │   │   ├── templateCategory.routes.ts
│   │   │   ├── templateCategory.service.ts
│   │   │   └── templateCategory.types.ts
│   │   ├── user/
│   │   │   ├── index.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.model.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.types.ts
│   └── server.ts
├── tsconfig.json
└── uploads/
```

## Repository
[https://github.com/parvejme24/style-zone-server.git](https://github.com/parvejme24/style-zone-server.git)

## API Documentation

- **Base URL:** `http://localhost:5000/api`
- **Backend Live URL:** `[YOUR_LIVE_URL_HERE]`

API documentation for each module is available in the [docs](docs/) folder:

- [Auth Module](docs/auth.md)
- [User Module](docs/user.md)
- [Blog Category Module](docs/blog-category.md)
- [Blog Module](docs/blog.md)
- [Template Category Module](docs/category.md)
- [Template Module](docs/product.md)
- [Order Module](docs/order.md)
- [Review Module](docs/review.md)
- [Chat Module](docs/chat.md)
- [Notification Module](docs/notification.md)
- [Wishlist Module](docs/wishlist.md)
- [Size Guide Module](docs/sizeGuide.md)
- [Newsletter Module](docs/newsletter.md)
- [Discount Module](docs/discount.md)

Each module documentation contains:
- Endpoints
- Request/Response examples
- Request type (GET, POST, etc.)
- Example data for testing
- Description of each endpoint

---

Feel free to contribute or open issues! 