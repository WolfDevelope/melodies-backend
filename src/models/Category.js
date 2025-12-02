import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên danh mục là bắt buộc'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['playlist', 'chart', 'genre', 'mood', 'activity', 'custom'],
      default: 'custom',
    },
    icon: {
      type: String,
      default: '🎵',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
    },
    contentType: {
      type: String,
      enum: ['songs', 'albums', 'artists', 'mixed'],
      default: 'songs',
    },
    songs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    }],
    albums: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
    }],
    artists: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
    }],
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    metadata: {
      color: {
        type: String,
        default: '#FF1493',
      },
      tags: [String],
      autoUpdate: {
        type: Boolean,
        default: false,
      },
      updateFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'manual'],
        default: 'manual',
      },
    },
    // Homepage display settings
    showOnHomepage: {
      type: Boolean,
      default: false,
    },
    homepageTitle: {
      type: String,
      trim: true,
    },
    homepageOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
categorySchema.index({ slug: 1 });
categorySchema.index({ type: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ order: 1 });
categorySchema.index({ isFeatured: 1 });

// Virtual for item count based on contentType
categorySchema.virtual('itemCount').get(function() {
  switch(this.contentType) {
    case 'songs':
      return this.songs ? this.songs.length : 0;
    case 'albums':
      return this.albums ? this.albums.length : 0;
    case 'artists':
      return this.artists ? this.artists.length : 0;
    case 'mixed':
      return (this.songs?.length || 0) + (this.albums?.length || 0) + (this.artists?.length || 0);
    default:
      return 0;
  }
});

// Keep songCount for backward compatibility
categorySchema.virtual('songCount').get(function() {
  return this.songs ? this.songs.length : 0;
});

// Ensure virtuals are included in JSON
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
