# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Database**: Set up a PostgreSQL database (recommended: Supabase, PlanetScale, or Railway)
3. **Cloud Storage**: Set up Cloudinary for file uploads

## Environment Variables

Add these environment variables in your Vercel project settings:

### Database
```
DATABASE_URL=your_postgresql_connection_string
```

### JWT
```
JWT_SECRET=your_jwt_secret_key
```

### Cloudinary (for file uploads)
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Email (if using)
```
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

### LemonSqueezy (for payments)
```
LEMONSQUEEZY_API_KEY=your_lemonsqueezy_api_key
```

## Deployment Steps

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **For production**:
   ```bash
   vercel --prod
   ```

## Database Setup

1. Run Prisma migrations on your production database:
   ```bash
   npx prisma migrate deploy
   ```

2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## File Uploads

Since Vercel doesn't support local file storage, all file uploads are configured to use Cloudinary. Make sure to:

1. Set up a Cloudinary account
2. Add Cloudinary environment variables
3. Update your frontend to handle Cloudinary URLs

## API Endpoints

Your API will be available at:
- Development: `https://your-project.vercel.app`
- Production: `https://your-project.vercel.app`

## Important Notes

- Vercel has a 10-second timeout for serverless functions
- File uploads are limited to 4.5MB per file
- Database connections are managed per request
- Static files should be served from cloud storage

## Troubleshooting

1. **Database Connection Issues**: Check your DATABASE_URL and ensure your database allows external connections
2. **File Upload Errors**: Verify Cloudinary credentials
3. **Build Errors**: Check the build logs in Vercel dashboard
4. **Environment Variables**: Ensure all required variables are set in Vercel project settings 