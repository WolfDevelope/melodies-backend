import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    songs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    }],
    isPublic: {
      type: Boolean,
      default: true,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
playlistSchema.index({ userId: 1, createdAt: -1 });
playlistSchema.index({ name: 'text', description: 'text' });

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;
