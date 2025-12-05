import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên nghệ sĩ là bắt buộc'],
      trim: true,
    },
    songs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    }],
    albums: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
    }],
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
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for song count
artistSchema.virtual('songCount').get(function() {
  return this.songs ? this.songs.length : 0;
});

// Virtual field for album count
artistSchema.virtual('albumCount').get(function() {
  return this.albums ? this.albums.length : 0;
});

// Ensure virtual fields are included in JSON
artistSchema.set('toJSON', { virtuals: true });
artistSchema.set('toObject', { virtuals: true });

// Index để tìm kiếm nhanh hơn
artistSchema.index({ name: 'text' });
artistSchema.index({ status: 1 });
artistSchema.index({ genre: 1 });
artistSchema.index({ verified: 1 });

const Artist = mongoose.model('Artist', artistSchema);

export default Artist;
