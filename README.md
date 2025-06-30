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
style-zone-server/
├── prisma/              # Prisma schema and migrations
├── src/
│   ├── config/          # Configuration files (e.g., database)
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── .env                 # Environment variables
├── package.json         # NPM scripts and dependencies
├── nodemon.json         # Nodemon config
└── README.md            # Project documentation
```

## Repository
[https://github.com/parvejme24/style-zone-server.git](https://github.com/parvejme24/style-zone-server.git)

## API Documentation

- **Base URL:** `http://localhost:5000/api`
- **Backend Live URL:** `[YOUR_LIVE_URL_HERE]`

API documentation for each module is available in the [docs](docs/) folder:

- [Auth Module](docs/auth.md)
- [User Module](docs/user.md)
- [Category Module](docs/category.md)
- [Product Module](docs/product.md)
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