import { Router } from 'express';
import { uploadVideo, handleVideoUpload, uploadThumbnail, handleThumbnailUpload } from '../middleware/videoUpload';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Video upload routes
router.post('/video', protect, authorize('admin', 'creator'), uploadVideo.single('video'), handleVideoUpload);
router.post('/thumbnail', protect, authorize('admin', 'creator'), uploadThumbnail.single('thumbnail'), handleThumbnailUpload);

export default router;
