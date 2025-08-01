# Auth and Upload System Updates

## Summary of Changes

### 1. Authentication Updates

#### Removed Features:
- OTP verification system
- `/me` route for getting current user
- Email verification requirement for login

#### Updated Features:
- **Registration**: Users are now auto-verified upon registration
- **Login**: Now returns complete user data along with tokens
- **Login Response**: Includes access token, refresh token, and user object with:
  - id, displayName, email, role, isVerified, createdAt, updatedAt

#### Files Modified:
- `src/modules/auth/auth.types.ts` - Removed OTP interfaces, added LoginResponse
- `src/modules/auth/auth.service.ts` - Removed OTP verification, auto-verify users
- `src/modules/auth/auth.controller.ts` - Removed OTP and /me endpoints
- `src/modules/auth/auth.routes.ts` - Updated routes

### 2. Upload System Reorganization

#### New Folder Structure:
```
uploads/
├── templateImage/          # Template thumbnail images
├── blogThumbnail/          # Blog thumbnail images  
├── blogContentImage/       # Blog content images
├── templateFile/           # Template zip files
├── templateScreenshots/    # Template screenshot images
├── userProfile/            # User profile images
├── blogCategoryImage/      # Blog category images
└── templateCategoryImage/  # Template category images
```

#### Updated Upload Middleware:
- `uploadTemplateImage` - For template images (5MB limit)
- `uploadBlogThumbnail` - For blog thumbnails (5MB limit)
- `uploadBlogContentImage` - For blog content images (10MB limit)
- `uploadTemplateFile` - For template zip files (100MB limit)
- `uploadTemplateScreenshots` - For template screenshots (5MB limit)
- `uploadUserProfile` - For user profile images (2MB limit)
- `uploadBlogCategoryImage` - For blog category images (5MB limit)
- `uploadTemplateCategoryImage` - For template category images (5MB limit)

#### Files Modified:
- `src/middlewares/upload.ts` - Complete rewrite with organized upload handlers
- `src/modules/template/template.controller.ts` - Updated file paths
- `src/modules/template/template.routes.ts` - Updated middleware usage
- `src/modules/template/template.types.ts` - Added fileUrl field
- `src/modules/blog/blog.controller.ts` - Updated file paths
- `src/modules/blog/blog.routes.ts` - Updated middleware usage
- `src/modules/user/user.controller.ts` - Updated file paths
- `src/modules/user/user.routes.ts` - Updated middleware usage
- `src/modules/templateCategory/templateCategory.controller.ts` - Updated file paths
- `src/modules/templateCategory/templateCategory.routes.ts` - Updated middleware usage
- `src/modules/blogCategory/blogCategory.controller.ts` - Updated file paths
- `src/modules/blogCategory/blogCategory.routes.ts` - Updated middleware usage

### 3. Database Schema Updates

#### Template Model:
- Added `fileUrl` field for storing zip file paths

#### Migration:
- Created migration: `20250730154531_add_file_url_to_template`

### 4. API Endpoints

#### Auth Endpoints:
- `POST /auth/register` - Register new user (auto-verified)
- `POST /auth/login` - Login with user data response
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/reset-password-request` - Request password reset
- `POST /auth/reset-password` - Reset password with OTP
- `POST /auth/logout` - Logout (requires auth)

#### Template Endpoints (Updated):
- `POST /templates` - Create template with image, zip file, and screenshots
- `PUT /templates/:id` - Update template with organized file uploads

#### Blog Endpoints (Updated):
- `POST /blogs` - Create blog with thumbnail and content images
- `PUT /blogs/:id` - Update blog with organized file uploads

#### User Endpoints (Updated):
- `PUT /users/:id` - Update user profile with profile image

#### Category Endpoints (Updated):
- `POST /template-categories` - Create template category with image
- `PUT /template-categories/:id` - Update template category with image
- `POST /blog-categories` - Create blog category with image
- `PUT /blog-categories/:id` - Update blog category with image

### 5. File Upload Specifications

#### Template Files:
- **Images**: JPG, JPEG, PNG, GIF, WEBP (5MB max)
- **Zip Files**: ZIP only (100MB max)
- **Screenshots**: JPG, JPEG, PNG, GIF, WEBP (5MB max)

#### Blog Files:
- **Thumbnails**: JPG, JPEG, PNG, GIF, WEBP (5MB max)
- **Content Images**: JPG, JPEG, PNG, GIF, WEBP (10MB max)

#### User Files:
- **Profile Images**: JPG, JPEG, PNG, GIF, WEBP (2MB max)

#### Category Files:
- **Blog Category Images**: JPG, JPEG, PNG, GIF, WEBP (5MB max)
- **Template Category Images**: JPG, JPEG, PNG, GIF, WEBP (5MB max)

### 6. Benefits

1. **Simplified Auth**: No more OTP verification, users can login immediately
2. **Better UX**: Login returns user data, no need for separate /me call
3. **Organized Files**: Clear separation of file types and purposes
4. **Better Security**: File type validation and size limits
5. **Scalability**: Organized folder structure for better file management
6. **Template Support**: Full zip file upload support for templates
7. **Category Support**: Dedicated folders for category images

### 7. Migration Notes

- Existing users will need to re-login to get the new response format
- Existing file uploads will continue to work but new uploads will use organized folders
- Database migration has been applied for template fileUrl field 