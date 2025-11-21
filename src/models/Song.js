import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tên bài hát là bắt buộc'],
      trim: true,
    },
    artist: {
      type: String,
      required: [true, 'Tên nghệ sĩ là bắt buộc'],
      trim: true,
    },
    album: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      enum: ['Pop', 'Ballad', 'Rock', 'EDM', 'R&B', 'Rap', 'Jazz', 'Classical'],
    },
    duration: {
      type: String,
      required: [true, 'Thời lượng là bắt buộc'],
      match: [/^\d+:\d{2}$/, 'Thời lượng phải có định dạng MM:SS'],
    },
    releaseDate: {
      type: Date,
    },
    plays: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100',
    },
    audioUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index để tìm kiếm nhanh hơn
songSchema.index({ title: 'text', artist: 'text', album: 'text' });
songSchema.index({ status: 1 });
songSchema.index({ genre: 1 });

const Song = mongoose.model('Song', songSchema);

export default Song;
