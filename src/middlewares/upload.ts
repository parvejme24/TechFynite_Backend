import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const uploadDirs = [
  'uploads/templateImage',
  'uploads/blogThumbnail', 
  'uploads/blogContentImage',
  'uploads/templateFile',
  'uploads/templateScreenshots',
  'uploads/userProfile',
  'uploads/blogCategoryImage',
  'uploads/templateCategoryImage'
];

uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '../../', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Base storage configuration
const createStorage = (destination: string) => multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../', destination));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

// File filter for different upload types
const createFileFilter = (allowedTypes: string[]) => (req: any, file: any, cb: any) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`Only ${allowedTypes.join(', ')} files are allowed`), false);
  }
};

// Template image upload (images only)
export const uploadTemplateImage = multer({
  storage: createStorage('uploads/templateImage'),
  fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Blog thumbnail upload (images only)
export const uploadBlogThumbnail = multer({
  storage: createStorage('uploads/blogThumbnail'),
  fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Blog content image upload (images only)
export const uploadBlogContentImage = multer({
  storage: createStorage('uploads/blogContentImage'),
  fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Combined blog upload middleware
export const uploadBlogFiles = multer({
  storage: createStorage('uploads'),
  fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'contentImages', maxCount: 20 }
]);

// Template file upload (zip files only)
export const uploadTemplateFile = multer({
  storage: createStorage('uploads/templateFile'),
  fileFilter: createFileFilter(['.zip']),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// Template screenshots upload (images only)
export const uploadTemplateScreenshots = multer({
  storage: createStorage('uploads/templateScreenshots'),
  fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Combined template upload middleware
export const uploadTemplateFiles = multer({
  storage: createStorage('uploads'),
  fileFilter: (req: any, file: any, cb: any) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    // Check field name to determine allowed file types
    if (file.fieldname === 'image' || file.fieldname === 'screenshots') {
      // Images allowed
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExtension)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for image and screenshots fields'), false);
      }
    } else if (file.fieldname === 'templateFile') {
      // ZIP files allowed
      if (fileExtension === '.zip') {
        cb(null, true);
      } else {
        cb(new Error('Only ZIP files are allowed for templateFile field'), false);
      }
    } else {
      cb(new Error(`Unexpected field: ${file.fieldname}`), false);
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'templateFile', maxCount: 1 },
  { name: 'screenshots', maxCount: 10 }
]);

// User profile upload (images only)
export const uploadUserProfile = multer({
  storage: createStorage('uploads/userProfile'),
  fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Blog category image upload (images only)
export const uploadBlogCategoryImage = multer({
  storage: createStorage('uploads/blogCategoryImage'),
  fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Template category image upload (images only)
export const uploadTemplateCategoryImage = multer({
  storage: createStorage('uploads/templateCategoryImage'),
  fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// General upload (for backward compatibility)
export const upload = multer({
  storage: createStorage('uploads'),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}); 