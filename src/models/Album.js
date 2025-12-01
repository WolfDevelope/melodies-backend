import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tên album là bắt buộc'],
      trim: true,
    },
    artist: {
      type: String,
      required: [true, 'Tên nghệ sĩ là bắt buộc'],
      trim: true,
    },
    genre: {
      type: String,
      enum: ['Pop', 'Ballad', 'Rock', 'EDM', 'R&B', 'Rap', 'Jazz', 'Classical'],
    },
    releaseDate: {
      type: Date,
    },
    totalTracks: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500',
    },
    plays: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes để tìm kiếm nhanh hơn
albumSchema.index({ title: 'text', artist: 'text' });
albumSchema.index({ status: 1 });
albumSchema.index({ genre: 1 });
albumSchema.index({ releaseDate: -1 });

const Album = mongoose.model('Album', albumSchema);

export default Album;
