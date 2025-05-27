import mongoose, { Document, Schema } from 'mongoose';

// Interface for User document
export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  bio?: string;
  role: 'admin' | 'creator' | 'viewer';
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Schema for User
const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    profileImage: {
      type: String
    },
    bio: {
      type: String
    },
    role: {
      type: String,
      enum: ['admin', 'creator', 'viewer'],
      default: 'viewer'
    },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      youtube: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IUser>('User', UserSchema);
