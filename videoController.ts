import { Request, Response } from 'express';
import Video, { IVideo } from '../models/Video';
import Category from '../models/Category';
import path from 'path';
import fs from 'fs';
import config from '../config';

// Get all videos
export const getAllVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, tag, status, author } = req.query;
    
    // Build query based on filters
    const query: any = {};
    
    if (category) {
      query.categories = category;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (author) {
      query.author = author;
    } else {
      // If no status filter and not filtering by author, default to published videos
      if (!status) {
        query.status = 'published';
      }
    }
    
    const videos = await Video.find(query)
      .populate('author', 'username firstName lastName profileImage')
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single video by ID
export const getVideoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('author', 'username firstName lastName profileImage')
      .populate('categories', 'name slug')
      .populate('comments.user', 'username firstName lastName profileImage');
      
    if (!video) {
      res.status(404).json({
        success: false,
        error: 'Video not found'
      });
      return;
    }
    
    // Increment view count
    video.viewCount += 1;
    await video.save();
    
    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new video
export const createVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    // Add author from authenticated user
    req.body.author = req.user.id;
    
    // If video is being published directly, set publishDate
    if (req.body.status === 'published') {
      req.body.publishDate = new Date();
    }
    
    // Create video
    const video = await Video.create(req.body);
    
    res.status(201).json({
      success: true,
      data: video
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

// Update video
export const updateVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    let video = await Video.findById(req.params.id);
    
    if (!video) {
      res.status(404).json({
        success: false,
        error: 'Video not found'
      });
      return;
    }
    
    // Check if user is the author or an admin
    if (video.author.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Not authorized to update this video'
      });
      return;
    }
    
    // If changing status to published, set publishDate
    if (req.body.status === 'published' && video.status !== 'published') {
      req.body.publishDate = new Date();
    }
    
    video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: video
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

// Delete video
export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      res.status(404).json({
        success: false,
        error: 'Video not found'
      });
      return;
    }
    
    // Check if user is the author or an admin
    if (video.author.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Not authorized to delete this video'
      });
      return;
    }
    
    // If it's an uploaded video, delete the file
    if (video.videoType === 'upload') {
      const videoPath = path.join(__dirname, '../../', video.videoUrl.replace(/^\//, ''));
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
      
      // Delete thumbnail if exists
      if (video.thumbnailUrl) {
        const thumbnailPath = path.join(__dirname, '../../', video.thumbnailUrl.replace(/^\//, ''));
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
        }
      }
    }
    
    await video.remove();
    
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

// Add comment to video
export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    
    if (!content) {
      res.status(400).json({
        success: false,
        error: 'Comment content is required'
      });
      return;
    }
    
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      res.status(404).json({
        success: false,
        error: 'Video not found'
      });
      return;
    }
    
    // Add comment
    const comment = {
      user: req.user.id,
      content,
      createdAt: new Date()
    };
    
    video.comments.push(comment);
    await video.save();
    
    // Populate user data in the new comment
    const populatedVideo = await Video.findById(req.params.id)
      .populate('comments.user', 'username firstName lastName profileImage');
      
    const newComment = populatedVideo?.comments[populatedVideo.comments.length - 1];
    
    res.status(201).json({
      success: true,
      data: newComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get videos by category
export const getVideosByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findOne({ slug: req.params.categorySlug });
    
    if (!category) {
      res.status(404).json({
        success: false,
        error: 'Category not found'
      });
      return;
    }
    
    const videos = await Video.find({ 
      categories: category._id,
      status: 'published'
    })
      .populate('author', 'username firstName lastName profileImage')
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
