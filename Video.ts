import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ICategory } from './Category';

// Interface for Comment
interface IComment {
  user: IUser['_id'];
  content: string;
  createdAt: Date;
}

// Interface for Video document
export interface IVideo extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoType: 'upload' | 'youtube' | 'vimeo';
  externalId?: string;
  thumbnailUrl?: string;
  author: IUser['_id'];
  categories: ICategory['_id'][];
  tags: string[];
  duration?: number;
  status: 'processing' | 'published' | 'archived';
  publishDate?: Date;
  viewCount: number;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

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

// Schema for Video
const VideoSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    videoType: {
      type: String,
      enum: ['upload', 'youtube', 'vimeo'],
      required: true
    },
    externalId: {
      type: String
    },
    thumbnailUrl: {
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
    duration: {
      type: Number
    },
    status: {
      type: String,
      enum: ['processing', 'published', 'archived'],
      default: 'processing'
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
VideoSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model<IVideo>('Video', VideoSchema);
