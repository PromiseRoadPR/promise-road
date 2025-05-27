import { Request, Response } from 'express';
import BlogPost, { IBlogPost } from '../models/BlogPost';
import Category from '../models/Category';

// Get all blog posts
export const getAllBlogPosts = async (req: Request, res: Response): Promise<void> => {
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
      // If no status filter and not filtering by author, default to published posts
      if (!status) {
        query.status = 'published';
      }
    }
    
    const blogPosts = await BlogPost.find(query)
      .populate('author', 'username firstName lastName profileImage')
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      count: blogPosts.length,
      data: blogPosts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single blog post by ID
export const getBlogPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogPost = await BlogPost.findById(req.params.id)
      .populate('author', 'username firstName lastName profileImage')
      .populate('categories', 'name slug')
      .populate('comments.user', 'username firstName lastName profileImage');
      
    if (!blogPost) {
      res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
      return;
    }
    
    // Increment view count
    blogPost.viewCount += 1;
    await blogPost.save();
    
    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new blog post
export const createBlogPost = async (req: Request, res: Response): Promise<void> => {
  try {
    // Add author from authenticated user
    req.body.author = req.user.id;
    
    // Create blog post
    const blogPost = await BlogPost.create(req.body);
    
    res.status(201).json({
      success: true,
      data: blogPost
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

// Update blog post
export const updateBlogPost = async (req: Request, res: Response): Promise<void> => {
  try {
    let blogPost = await BlogPost.findById(req.params.id);
    
    if (!blogPost) {
      res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
      return;
    }
    
    // Check if user is the author or an admin
    if (blogPost.author.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Not authorized to update this blog post'
      });
      return;
    }
    
    // If changing status to published, set publishDate
    if (req.body.status === 'published' && blogPost.status !== 'published') {
      req.body.publishDate = new Date();
    }
    
    blogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: blogPost
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

// Delete blog post
export const deleteBlogPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    
    if (!blogPost) {
      res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
      return;
    }
    
    // Check if user is the author or an admin
    if (blogPost.author.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Not authorized to delete this blog post'
      });
      return;
    }
    
    await blogPost.remove();
    
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

// Add comment to blog post
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
    
    const blogPost = await BlogPost.findById(req.params.id);
    
    if (!blogPost) {
      res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
      return;
    }
    
    // Add comment
    const comment = {
      user: req.user.id,
      content,
      createdAt: new Date()
    };
    
    blogPost.comments.push(comment);
    await blogPost.save();
    
    // Populate user data in the new comment
    const populatedBlogPost = await BlogPost.findById(req.params.id)
      .populate('comments.user', 'username firstName lastName profileImage');
      
    const newComment = populatedBlogPost?.comments[populatedBlogPost.comments.length - 1];
    
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

// Get blogs by category
export const getBlogsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findOne({ slug: req.params.categorySlug });
    
    if (!category) {
      res.status(404).json({
        success: false,
        error: 'Category not found'
      });
      return;
    }
    
    const blogPosts = await BlogPost.find({ 
      categories: category._id,
      status: 'published'
    })
      .populate('author', 'username firstName lastName profileImage')
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      count: blogPosts.length,
      data: blogPosts,
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
