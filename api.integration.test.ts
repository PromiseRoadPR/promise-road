import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Category from '../models/Category';
import BlogPost from '../models/BlogPost';
import authRoutes from '../routes/authRoutes';
import blogRoutes from '../routes/blogRoutes';
import categoryRoutes from '../routes/categoryRoutes';
import config from '../config';

// Create express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);

// Mock middleware
vi.mock('../middleware/auth', () => {
  return {
    protect: (req, res, next) => {
      req.user = {
        id: '507f1f77bcf86cd799439011', // Mock user ID
        role: 'creator'
      };
      next();
    },
    authorize: (...roles) => {
      return (req, res, next) => {
        next();
      };
    }
  };
});

describe('API Integration Tests', () => {
  let mongoServer: MongoMemoryServer;
  let testUser;
  let testCategory;
  let testBlogPost;
  let authToken;

  // Setup in-memory MongoDB server
  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Create test user
    const passwordHash = await bcrypt.hash('password123', 10);
    testUser = await User.create({
      username: 'integrationuser',
      email: 'integration@example.com',
      passwordHash,
      firstName: 'Integration',
      lastName: 'Test',
      role: 'creator'
    });

    // Create auth token
    authToken = jwt.sign(
      { id: testUser._id, role: testUser.role },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    // Create test category
    testCategory = await Category.create({
      name: 'Integration Test',
      slug: 'integration-test',
      description: 'Category for integration tests',
      contentType: 'both'
    });

    // Create test blog post
    testBlogPost = await BlogPost.create({
      title: 'Integration Test Blog Post',
      content: '<p>This is a test blog post for integration testing.</p>',
      author: testUser._id,
      categories: [testCategory._id],
      status: 'published',
      tags: ['integration', 'test']
    });
  });

  // Clean up after tests
  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    vi.resetAllMocks();
  });

  describe('Authentication API', () => {
    it('should login a user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'integration@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('integration@example.com');
    });

    it('should fail login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'integration@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Blog API', () => {
    it('should get all blog posts', async () => {
      const response = await request(app)
        .get('/api/blogs');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get a single blog post by ID', async () => {
      const response = await request(app)
        .get(`/api/blogs/${testBlogPost._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.title).toBe('Integration Test Blog Post');
    });

    it('should create a new blog post', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'New Test Blog Post',
          content: '<p>This is a new test blog post.</p>',
          categories: [testCategory._id],
          status: 'draft',
          tags: ['new', 'test']
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.title).toBe('New Test Blog Post');
      expect(response.body.data.status).toBe('draft');
    });
  });

  describe('Category API', () => {
    it('should get all categories', async () => {
      const response = await request(app)
        .get('/api/categories');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get a single category by ID', async () => {
      const response = await request(app)
        .get(`/api/categories/${testCategory._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe('Integration Test');
    });
  });
});
