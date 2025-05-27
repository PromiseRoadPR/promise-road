import { Router } from 'express';
import { 
  getAllPlaylists, 
  getPlaylistById, 
  createPlaylist, 
  updatePlaylist, 
  deletePlaylist, 
  addVideoToPlaylist,
  removeVideoFromPlaylist
} from '../controllers/playlistController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllPlaylists);
router.get('/:id', getPlaylistById);

// Protected routes
router.post('/', protect, authorize('admin', 'creator'), createPlaylist);
router.put('/:id', protect, authorize('admin', 'creator'), updatePlaylist);
router.delete('/:id', protect, authorize('admin', 'creator'), deletePlaylist);
router.post('/:id/videos', protect, authorize('admin', 'creator'), addVideoToPlaylist);
router.delete('/:id/videos/:videoId', protect, authorize('admin', 'creator'), removeVideoFromPlaylist);

export default router;
