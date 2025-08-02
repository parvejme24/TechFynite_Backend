# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `JWT_SECRET` - JWT signing secret
- [ ] `JWT_REFRESH_SECRET` - JWT refresh secret
- [ ] `EMAIL_HOST` - SMTP host for emails
- [ ] `EMAIL_PORT` - SMTP port (usually 587)
- [ ] `EMAIL_USER` - Email username
- [ ] `EMAIL_PASS` - Email password
- [ ] `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret
- [ ] `MAILCHIMP_API_KEY` - Mailchimp API key
- [ ] `MAILCHIMP_SERVER_PREFIX` - Mailchimp server prefix
- [ ] `FIREBASE_PROJECT_ID` - Firebase project ID
- [ ] `FIREBASE_PRIVATE_KEY` - Firebase private key
- [ ] `FIREBASE_CLIENT_EMAIL` - Firebase client email
- [ ] `LEMONSQUEEZY_WEBHOOK_SECRET` - LemonSqueezy webhook secret

### 2. Database Setup
- [ ] PostgreSQL database created and accessible
- [ ] Database connection string tested locally
- [ ] Prisma schema is up to date
- [ ] Database migrations are ready

### 3. File Storage
- [ ] Cloudinary account configured
- [ ] Cloudinary environment variables set
- [ ] File upload functionality tested

### 4. Code Preparation
- [ ] All environment variables removed from code
- [ ] CORS origins updated for production
- [ ] Error handling optimized for serverless
- [ ] Database connection optimized for Vercel

### 5. Testing
- [ ] Local build successful: `npm run build`
- [ ] Local development server works: `npm run dev`
- [ ] API endpoints tested locally
- [ ] Database queries optimized

## 🚀 Deployment Steps

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Set Environment Variables
```bash
# Set each environment variable in Vercel dashboard
# Or use vercel env add command
vercel env add DATABASE_URL
vercel env add JWT_SECRET
# ... add all other variables
```

### Step 4: Deploy
```bash
# Option 1: Using deploy script
./deploy.sh

# Option 2: Using npm script
npm run deploy

# Option 3: Direct Vercel command
vercel --prod
```

## ✅ Post-Deployment Checklist

### 1. Database Migration
- [ ] Run database migrations on production
- [ ] Verify database connection works
- [ ] Test database queries

### 2. API Testing
- [ ] Test health check endpoint: `/health`
- [ ] Test main API endpoints
- [ ] Verify CORS is working
- [ ] Test file uploads (if applicable)

### 3. Environment Verification
- [ ] All environment variables are set correctly
- [ ] Database connection is stable
- [ ] Email functionality works
- [ ] File uploads work with Cloudinary

### 4. Performance Check
- [ ] API response times are acceptable
- [ ] No cold start issues
- [ ] Database queries are optimized
- [ ] File uploads are working

### 5. Security Check
- [ ] Environment variables are not exposed
- [ ] CORS is properly configured
- [ ] Rate limiting is active
- [ ] Authentication is working

## 🔧 Troubleshooting

### Common Issues & Solutions

1. **Database Connection Failed**
   - Check `DATABASE_URL` format
   - Ensure database is accessible from Vercel
   - Verify SSL settings if required

2. **Build Errors**
   - Check TypeScript compilation
   - Verify all dependencies are installed
   - Check for missing environment variables

3. **Function Timeout**
   - Optimize database queries
   - Use connection pooling
   - Break large operations into smaller chunks

4. **File Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper CORS configuration

## 📞 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🎯 Next Steps After Deployment

1. **Monitoring Setup**
   - Set up Vercel Analytics
   - Configure error tracking
   - Set up performance monitoring

2. **CI/CD Pipeline**
   - Connect GitHub repository
   - Set up automatic deployments
   - Configure preview deployments

3. **Domain & SSL**
   - Set up custom domain
   - Configure SSL certificate
   - Set up redirects if needed

4. **Backup Strategy**
   - Set up database backups
   - Configure file storage backups
   - Document recovery procedures 