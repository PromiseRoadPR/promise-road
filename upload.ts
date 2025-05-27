import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../', config.uploadDir);
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Initialize upload
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload image handler
export const uploadImage = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      error: 'Please upload a file'
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      fileName: req.file.filename,
      filePath: `/${config.uploadDir}/${req.file.filename}`
    }
  });
};
