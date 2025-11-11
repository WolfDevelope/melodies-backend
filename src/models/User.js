import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    password: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
      minlength: [10, 'Mật khẩu phải có ít nhất 10 ký tự'],
    },
    name: {
      type: String,
      required: [true, 'Tên là bắt buộc'],
      trim: true,
    },
    birthday: {
      type: String,
      required: [true, 'Ngày sinh là bắt buộc'],
    },
    gender: {
      type: String,
      required: [true, 'Giới tính là bắt buộc'],
      enum: ['male', 'female', 'non-binary', 'prefer-not-to-say', 'Nam', 'Nữ', 'Khác', 'Không muốn tiết lộ'],
    },
    country: {
      type: String,
    },
    marketingConsent: {
      type: Boolean,
      default: false,
    },
    dataSharing: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationOTP: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  }
);

// Index để tìm kiếm nhanh hơn
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
