import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User';
import BlogPost from '../models/BlogPost';
import Category from '../models/Category';

// Mock data
const mockUser = {
  username: 'testuser',
  email: 'test@example.com',
  passwordHash: 'hashedpassword',
  firstName: 'Test',
  lastName: 'User',
  role: 'creator'
};

const mockCategory = {
  name: 'Faith',
  slug: 'faith',
  description: 'Articles about faith',
  contentType: 'blog'
};

const mockBlogPost = {
  title: 'Test Blog Post',
  content: '<p>This is a test blog post content.</p>',
  status: 'published',
  tags: ['test', 'blog']
};

describe('Blog Model Tests', () => {
  let mongoServer: MongoMemoryServer;
  let userId: mongoose.Types.ObjectId;
  let categoryId: mongoose.Types.ObjectId;

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

  it('should create a blog post successfully', async () => {
    const blogPostData = {
      ...mockBlogPost,
      author: userId,
      categories: [categoryId]
    };

    const blogPost = await BlogPost.create(blogPostData);
    
    expect(blogPost).toBeDefined();
    expect(blogPost.title).toBe(mockBlogPost.title);
    expect(blogPost.content).toBe(mockBlogPost.content);
    expect(blogPost.status).toBe(mockBlogPost.status);
    expect(blogPost.author).toEqual(userId);
    expect(blogPost.categories[0]).toEqual(categoryId);
    expect(blogPost.viewCount).toBe(0);
    expect(blogPost.comments).toHaveLength(0);
  });

  it('should fail to create a blog post without required fields', async () => {
    const invalidBlogPost = {
      content: '<p>Missing title</p>',
      author: userId
    };

    await expect(BlogPost.create(invalidBlogPost)).rejects.toThrow();
  });

  it('should update a blog post successfully', async () => {
    const blogPostData = {
      ...mockBlogPost,
      author: userId,
      categories: [categoryId]
    };

    const blogPost = await BlogPost.create(blogPostData);
    
    const updatedTitle = 'Updated Test Blog Post';
    blogPost.title = updatedTitle;
    await blogPost.save();
    
    const updatedBlogPost = await BlogPost.findById(blogPost._id);
    expect(updatedBlogPost).toBeDefined();
    expect(updatedBlogPost!.title).toBe(updatedTitle);
  });

  it('should add a comment to a blog post', async () => {
    const blogPostData = {
      ...mockBlogPost,
      author: userId,
      categories: [categoryId]
    };

    const blogPost = await BlogPost.create(blogPostData);
    
    const comment = {
      user: userId,
      content: 'This is a test comment',
      createdAt: new Date()
    };
    
    blogPost.comments.push(comment);
    await blogPost.save();
    
    const updatedBlogPost = await BlogPost.findById(blogPost._id);
    expect(updatedBlogPost).toBeDefined();
    expect(updatedBlogPost!.comments).toHaveLength(1);
    expect(updatedBlogPost!.comments[0].content).toBe(comment.content);
    expect(updatedBlogPost!.comments[0].user).toEqual(userId);
  });

  it('should increment view count when accessed', async () => {
    const blogPostData = {
      ...mockBlogPost,
      author: userId,
      categories: [categoryId]
    };

    const blogPost = await BlogPost.create(blogPostData);
    
    blogPost.viewCount += 1;
    await blogPost.save();
    
    const updatedBlogPost = await BlogPost.findById(blogPost._id);
    expect(updatedBlogPost).toBeDefined();
    expect(updatedBlogPost!.viewCount).toBe(1);
  });
});
