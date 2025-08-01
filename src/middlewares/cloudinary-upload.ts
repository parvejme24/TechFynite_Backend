import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

// Cloudinary storage configuration
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'techfynite',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'zip'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  } as any,
});

// File filter function
const fileFilter = (req: any, file: any, cb: any) => {
  const fileExtension = file.originalname.toLowerCase().split('.').pop();
  
  if (file.fieldname === 'image' || file.fieldname === 'screenshots') {
    // Images allowed
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for image and screenshots fields'), false);
    }
  } else if (file.fieldname === 'templateFile') {
    // ZIP files allowed
    if (fileExtension === 'zip') {
      cb(null, true);
    } else {
      cb(new Error('Only ZIP files are allowed for templateFile field'), false);
    }
  } else {
    cb(new Error(`Unexpected field: ${file.fieldname}`), false);
  }
};

// Combined template upload middleware for Cloudinary
export const uploadTemplateFilesCloudinary = multer({
  storage: cloudinaryStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'templateFile', maxCount: 1 },
  { name: 'screenshots', maxCount: 10 }
]);

// Blog upload middleware for Cloudinary
export const uploadBlogFilesCloudinary = multer({
  storage: cloudinaryStorage,
  fileFilter: (req: any, file: any, cb: any) => {
    const fileExtension = file.originalname.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'contentImages', maxCount: 20 }
]);

// User profile upload middleware for Cloudinary
export const uploadUserProfileCloudinary = multer({
  storage: cloudinaryStorage,
  fileFilter: (req: any, file: any, cb: any) => {
    const fileExtension = file.originalname.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
}).single('image');

// Category image upload middleware for Cloudinary
export const uploadCategoryImageCloudinary = multer({
  storage: cloudinaryStorage,
  fileFilter: (req: any, file: any, cb: any) => {
    const fileExtension = file.originalname.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('image'); 