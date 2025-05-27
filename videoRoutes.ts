import { Router } from 'express';
import { 
  getAllVideos, 
  getVideoById, 
  createVideo, 
  updateVideo, 
  deleteVideo, 
  addComment,
  getVideosByCategory
} from '../controllers/videoController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllVideos);
router.get('/:id', getVideoById);
router.get('/categories/:categorySlug', getVideosByCategory);

// Protected routes
router.post('/', protect, authorize('admin', 'creator'), createVideo);
router.put('/:id', protect, authorize('admin', 'creator'), updateVideo);
router.delete('/:id', protect, authorize('admin', 'creator'), deleteVideo);
router.post('/:id/comments', protect, addComment);

export default router;
