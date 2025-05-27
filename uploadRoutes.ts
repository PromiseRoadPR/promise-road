import { Router } from 'express';
import { upload, uploadImage } from '../middleware/upload';
import { protect } from '../middleware/auth';

const router = Router();

// Upload route
router.post('/image', protect, upload.single('image'), uploadImage);

export default router;
