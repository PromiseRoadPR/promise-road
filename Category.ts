import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

// Interface for Category document
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parentCategory?: ICategory['_id'];
  contentType: 'blog' | 'video' | 'both';
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Category
const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    description: {
      type: String
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    contentType: {
      type: String,
      enum: ['blog', 'video', 'both'],
      default: 'both'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICategory>('Category', CategorySchema);
