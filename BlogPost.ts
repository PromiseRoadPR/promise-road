import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ICategory } from './Category';

// Interface for Scripture Reference
interface IScriptureReference {
  book: string;
  chapter: number;
  verse: string;
  translation: string;
  text: string;
}

// Interface for Comment
interface IComment {
  user: IUser['_id'];
  content: string;
  createdAt: Date;
}

// Interface for Blog Post document
export interface IBlogPost extends Document {
  title: string;
  content: string;
  featuredImage?: string;
  author: IUser['_id'];
  categories: ICategory['_id'][];
  tags: string[];
  scriptureReferences?: IScriptureReference[];
  status: 'draft' | 'published' | 'archived';
  publishDate?: Date;
  viewCount: number;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Scripture Reference
const ScriptureReferenceSchema: Schema = new Schema({
  book: {
    type: String,
    required: true
  },
  chapter: {
    type: Number,
    required: true
  },
  verse: {
    type: String,
    required: true
  },
  translation: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

// Schema for Comment
const CommentSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for Blog Post
const BlogPostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    featuredImage: {
      type: String
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }],
    tags: [{
      type: String,
      trim: true
    }],
    scriptureReferences: [ScriptureReferenceSchema],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    publishDate: {
      type: Date
    },
    viewCount: {
      type: Number,
      default: 0
    },
    comments: [CommentSchema]
  },
  {
    timestamps: true
  }
);

// Create text index for search functionality
BlogPostSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
