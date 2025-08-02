# Vercel Deployment Guide

## 🚀 Quick Deploy

### Option 1: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 2: Using Deploy Script
```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Option 3: Using npm scripts
```bash
# Install dependencies and deploy
npm run deploy
```

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm install -g vercel`
3. **Environment Variables**: Set up in Vercel dashboard

## 🔧 Environment Variables Setup

Set these environment variables in your Vercel project dashboard:

### Database
```
DATABASE_URL=your_postgresql_connection_string
```

### Authentication
```
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

### Email (Nodemailer)
```
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Cloudinary (File Uploads)
```
CLOUDINARY_CLOUD_NAME=dwssxatb3
CLOUDINARY_API_KEY=237299913638697
CLOUDINARY_API_SECRET=s7H8MRNsI0VFgqbTMPIovmB-Y_Q
```

### Mailchimp (Newsletter)
```
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_SERVER_PREFIX=your_server_prefix
```

### Firebase (Push Notifications)
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

### Payment (LemonSqueezy)
```
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret
```

## 🏗️ Project Structure

```
├── api/
│   └── index.ts          # Vercel serverless function entry point
├── src/
│   ├── app.ts            # Express app configuration
│   ├── server.ts         # Development server
│   ├── config/           # Configuration files
│   ├── modules/          # API route modules
│   └── middlewares/      # Express middlewares
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── uploads/              # File uploads (excluded from deployment)
├── vercel.json           # Vercel configuration
├── .vercelignore         # Files to exclude from deployment
└── package.json          # Dependencies and scripts
```

## 🔄 Database Migration

After deployment, run database migrations:

```bash
# Connect to your production database
npx prisma db push

# Or run migrations
npx prisma migrate deploy
```

## 📁 File Uploads

The `uploads/` directory is excluded from Vercel deployment. For production:

1. **Use Cloudinary**: Configure in your environment variables
2. **Use External Storage**: AWS S3, Google Cloud Storage, etc.
3. **Use Vercel Blob**: For simple file storage

## 🚨 Important Notes

1. **Cold Starts**: Vercel functions have cold starts. Consider using connection pooling for database connections.

2. **Function Timeout**: Default timeout is 10 seconds. Extended to 30 seconds in `vercel.json`.

3. **Environment Variables**: All sensitive data should be set in Vercel dashboard, not in code.

4. **Database**: Ensure your PostgreSQL database is accessible from Vercel's servers.

5. **CORS**: Update CORS origins in `src/app.ts` with your production domain.

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` in Vercel environment variables
   - Ensure database is accessible from Vercel's IP ranges

2. **Build Errors**
   - Check TypeScript compilation: `npm run build`
   - Verify all dependencies are in `package.json`

3. **Function Timeout**
   - Optimize database queries
   - Use connection pooling
   - Consider breaking large operations

4. **File Upload Issues**
   - Configure Cloudinary or external storage
   - Check file size limits

### Debug Commands

```bash
# Test build locally
npm run build

# Test Vercel functions locally
vercel dev

# Check Vercel logs
vercel logs

# View function details
vercel inspect
```

## 📞 Support

For deployment issues:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review Vercel logs in dashboard
3. Test locally with `vercel dev`

## 🎯 Next Steps

After successful deployment:

1. ✅ Set up custom domain (optional)
2. ✅ Configure monitoring and analytics
3. ✅ Set up CI/CD pipeline
4. ✅ Configure backup strategies
5. ✅ Set up monitoring alerts 