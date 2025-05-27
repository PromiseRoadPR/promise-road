import { Router } from 'express';
import { 
  getAllBlogPosts, 
  getBlogPostById, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  addComment,
  getBlogsByCategory
} from '../controllers/blogController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllBlogPosts);
router.get('/:id', getBlogPostById);
router.get('/categories/:categorySlug', getBlogsByCategory);

// Protected routes
router.post('/', protect, authorize('admin', 'creator'), createBlogPost);
router.put('/:id', protect, authorize('admin', 'creator'), updateBlogPost);
router.delete('/:id', protect, authorize('admin', 'creator'), deleteBlogPost);
router.post('/:id/comments', protect, addComment);

export default router;
