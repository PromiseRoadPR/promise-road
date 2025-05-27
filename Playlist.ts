import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IVideo } from './Video';

// Interface for Playlist document
export interface IPlaylist extends Document {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  creator: IUser['_id'];
  videos: IVideo['_id'][];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Playlist
const PlaylistSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    thumbnailUrl: {
      type: String
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    videos: [{
      type: Schema.Types.ObjectId,
      ref: 'Video'
    }],
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
