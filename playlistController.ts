import { Request, Response } from 'express';
import Playlist, { IPlaylist } from '../models/Playlist';
import Video from '../models/Video';

// Get all playlists
export const getAllPlaylists = async (req: Request, res: Response): Promise<void> => {
  try {
    const { creator, isPublic } = req.query;
    
    // Build query based on filters
    const query: any = {};
    
    if (creator) {
      query.creator = creator;
    }
    
    if (isPublic !== undefined) {
      query.isPublic = isPublic === 'true';
    } else {
      // If not specified and not the creator, only show public playlists
      if (!creator || creator.toString() !== req.user?.id) {
        query.isPublic = true;
      }
    }
    
    const playlists = await Playlist.find(query)
      .populate('creator', 'username firstName lastName profileImage')
      .populate({
        path: 'videos',
        select: 'title thumbnailUrl duration viewCount',
        match: { status: 'published' }
      })
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      count: playlists.length,
      data: playlists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single playlist by ID
export const getPlaylistById = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('creator', 'username firstName lastName profileImage')
      .populate({
        path: 'videos',
        select: 'title description thumbnailUrl videoUrl videoType duration viewCount author',
        populate: {
          path: 'author',
          select: 'username firstName lastName profileImage'
        }
      });
      
    if (!playlist) {
      res.status(404).json({
        success: false,
        error: 'Playlist not found'
      });
      return;
    }
    
    // Check if playlist is private and user is not the creator
    if (!playlist.isPublic && (!req.user || playlist.creator._id.toString() !== req.user.id)) {
      res.status(403).json({
        success: false,
        error: 'This playlist is private'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new playlist
export const createPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    // Add creator from authenticated user
    req.body.creator = req.user.id;
    
    // Create playlist
    const playlist = await Playlist.create(req.body);
    
    res.status(201).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map(val => (val as any).message);
      res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// Update playlist
export const updatePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    let playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      res.status(404).json({
        success: false,
        error: 'Playlist not found'
      });
      return;
    }
    
    // Check if user is the creator or an admin
    if (playlist.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Not authorized to update this playlist'
      });
      return;
    }
    
    playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map(val => (val as any).message);
      res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// Delete playlist
export const deletePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      res.status(404).json({
        success: false,
        error: 'Playlist not found'
      });
      return;
    }
    
    // Check if user is the creator or an admin
    if (playlist.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Not authorized to delete this playlist'
      });
      return;
    }
    
    await playlist.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Add video to playlist
export const addVideoToPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.body;
    
    if (!videoId) {
      res.status(400).json({
        success: false,
        error: 'Video ID is required'
      });
      return;
    }
    
    // Check if video exists and is published
    const video = await Video.findById(videoId);
    if (!video) {
      res.status(404).json({
        success: false,
        error: 'Video not found'
      });
      return;
    }
    
    if (video.status !== 'published' && video.author.toString() !== req.user.id) {
      res.status(400).json({
        success: false,
        error: 'Video is not published'
      });
      return;
    }
    
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      res.status(404).json({
        success: false,
        error: 'Playlist not found'
      });
      return;
    }
    
    // Check if user is the creator
    if (playlist.creator.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to modify this playlist'
      });
      return;
    }
    
    // Check if video is already in playlist
    if (playlist.videos.includes(videoId as any)) {
      res.status(400).json({
        success: false,
        error: 'Video is already in playlist'
      });
      return;
    }
    
    // Add video to playlist
    playlist.videos.push(videoId as any);
    await playlist.save();
    
    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Remove video from playlist
export const removeVideoFromPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      res.status(404).json({
        success: false,
        error: 'Playlist not found'
      });
      return;
    }
    
    // Check if user is the creator
    if (playlist.creator.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to modify this playlist'
      });
      return;
    }
    
    // Remove video from playlist
    playlist.videos = playlist.videos.filter(
      (video) => video.toString() !== videoId
    );
    
    await playlist.save();
    
    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
