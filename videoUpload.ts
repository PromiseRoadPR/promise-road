import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config';

// Configure storage for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../', config.uploadDir, '/videos');
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
    cb(null, 'video-' + uniqueSuffix + ext);
  }
});

// File filter for videos
const videoFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept video files only
  const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'));
  }
};

// Initialize video upload
export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit
});

// Upload video handler
export const handleVideoUpload = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      error: 'Please upload a video file'
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      fileName: req.file.filename,
      filePath: `/${config.uploadDir}/videos/${req.file.filename}`
    }
  });
};

// Configure storage for thumbnails
const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../', config.uploadDir, '/thumbnails');
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
    cb(null, 'thumbnail-' + uniqueSuffix + ext);
  }
});

// File filter for thumbnails
const thumbnailFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept image files only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for thumbnails!'));
  }
};

// Initialize thumbnail upload
export const uploadThumbnail = multer({
  storage: thumbnailStorage,
  fileFilter: thumbnailFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload thumbnail handler
export const handleThumbnailUpload = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      error: 'Please upload a thumbnail image'
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      fileName: req.file.filename,
      filePath: `/${config.uploadDir}/thumbnails/${req.file.filename}`
    }
  });
};
