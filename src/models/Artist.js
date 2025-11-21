import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên nghệ sĩ là bắt buộc'],
      trim: true,
    },
    genre: {
      type: String,
      enum: ['Pop', 'Ballad', 'Rock', 'EDM', 'R&B', 'Rap', 'Jazz', 'Classical'],
    },
    bio: {
      type: String,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    totalSongs: {
      type: Number,
      default: 0,
    },
    totalAlbums: {
      type: Number,
      default: 0,
    },
    followers: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100',
    },
  },
  {
    timestamps: true,
  }
);

// Index để tìm kiếm nhanh hơn
artistSchema.index({ name: 'text' });
artistSchema.index({ status: 1 });
artistSchema.index({ genre: 1 });
artistSchema.index({ verified: 1 });

const Artist = mongoose.model('Artist', artistSchema);

export default Artist;
