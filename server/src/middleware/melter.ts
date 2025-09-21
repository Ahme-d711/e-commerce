import multer from 'multer';
import { Request, Express } from 'express';
import { MulterFile } from '../types/express-multer.js';

// Configure multer storage and file filter
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request, 
  file: Express.Multer.File, 
  cb: multer.FileFilterCallback
) => {
  // Accept image files only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  }
});

export default upload;