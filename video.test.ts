import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User';
import Video from '../models/Video';
import Playlist from '../models/Playlist';
import Category from '../models/Category';

// Mock data
const mockUser = {
  username: 'videouser',
  email: 'video@example.com',
  passwordHash: 'hashedpassword',
  firstName: 'Video',
  lastName: 'User',
  role: 'creator'
};

const mockCategory = {
  name: 'Worship',
  slug: 'worship',
  description: 'Worship videos',
  contentType: 'video'
};

const mockVideo = {
  title: 'Test Worship Video',
  description: 'This is a test worship video description.',
  videoUrl: '/uploads/videos/test-video.mp4',
  videoType: 'upload',
  thumbnailUrl: '/uploads/thumbnails/test-thumbnail.jpg',
  status: 'published',
  tags: ['worship', 'test']
};

const mockPlaylist = {
  title: 'Test Playlist',
  description: 'A test playlist for worship videos',
  isPublic: true
};

describe('Video and Playlist Model Tests', () => {
  let mongoServer: MongoMemoryServer;
  let userId: mongoose.Types.ObjectId;
  let categoryId: mongoose.Types.ObjectId;
  let videoId: mongoose.Types.ObjectId;

  // Setup in-memory MongoDB server
  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Create test user and category
    const user = await User.create(mockUser);
    userId = user._id;

    const category = await Category.create(mockCategory);
    categoryId = category._id;
  });

  // Clean up after tests
  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('should create a video successfully', async () => {
    const videoData = {
      ...mockVideo,
      author: userId,
      categories: [categoryId]
    };

    const video = await Video.create(videoData);
    
    expect(video).toBeDefined();
    expect(video.title).toBe(mockVideo.title);
    expect(video.description).toBe(mockVideo.description);
    expect(video.videoUrl).toBe(mockVideo.videoUrl);
    expect(video.videoType).toBe(mockVideo.videoType);
    expect(video.status).toBe(mockVideo.status);
    expect(video.author).toEqual(userId);
    expect(video.categories[0]).toEqual(categoryId);
    expect(video.viewCount).toBe(0);
    expect(video.comments).toHaveLength(0);
  });

  it('should fail to create a video without required fields', async () => {
    const invalidVideo = {
      description: 'Missing title and videoUrl',
      author: userId
    };

    await expect(Video.create(invalidVideo)).rejects.toThrow();
  });

  it('should update a video successfully', async () => {
    const videoData = {
      ...mockVideo,
      author: userId,
      categories: [categoryId]
    };

    const video = await Video.create(videoData);
    
    const updatedTitle = 'Updated Test Video';
    video.title = updatedTitle;
    await video.save();
    
    const updatedVideo = await Video.findById(video._id);
    expect(updatedVideo).toBeDefined();
    expect(updatedVideo!.title).toBe(updatedTitle);
  });

  it('should create a playlist successfully', async () => {
    // First create a video to add to the playlist
    const videoData = {
      ...mockVideo,
      author: userId,
      categories: [categoryId]
    };

    const video = await Video.create(videoData);
    videoId = video._id;
    
    const playlistData = {
      ...mockPlaylist,
      creator: userId,
      videos: [videoId]
    };

    const playlist = await Playlist.create(playlistData);
    
    expect(playlist).toBeDefined();
    expect(playlist.title).toBe(mockPlaylist.title);
    expect(playlist.description).toBe(mockPlaylist.description);
    expect(playlist.isPublic).toBe(mockPlaylist.isPublic);
    expect(playlist.creator).toEqual(userId);
    expect(playlist.videos).toHaveLength(1);
    expect(playlist.videos[0]).toEqual(videoId);
  });

  it('should add a video to a playlist', async () => {
    // Create two videos
    const videoData1 = {
      ...mockVideo,
      author: userId,
      categories: [categoryId]
    };

    const video1 = await Video.create(videoData1);
    
    const videoData2 = {
      ...mockVideo,
      title: 'Second Test Video',
      author: userId,
      categories: [categoryId]
    };

    const video2 = await Video.create(videoData2);
    
    // Create playlist with first video
    const playlistData = {
      ...mockPlaylist,
      creator: userId,
      videos: [video1._id]
    };

    const playlist = await Playlist.create(playlistData);
    
    // Add second video to playlist
    playlist.videos.push(video2._id);
    await playlist.save();
    
    const updatedPlaylist = await Playlist.findById(playlist._id);
    expect(updatedPlaylist).toBeDefined();
    expect(updatedPlaylist!.videos).toHaveLength(2);
    expect(updatedPlaylist!.videos[1]).toEqual(video2._id);
  });

  it('should add a comment to a video', async () => {
    const videoData = {
      ...mockVideo,
      author: userId,
      categories: [categoryId]
    };

    const video = await Video.create(videoData);
    
    const comment = {
      user: userId,
      content: 'This is a test comment on a video',
      createdAt: new Date()
    };
    
    video.comments.push(comment);
    await video.save();
    
    const updatedVideo = await Video.findById(video._id);
    expect(updatedVideo).toBeDefined();
    expect(updatedVideo!.comments).toHaveLength(1);
    expect(updatedVideo!.comments[0].content).toBe(comment.content);
    expect(updatedVideo!.comments[0].user).toEqual(userId);
  });
});
