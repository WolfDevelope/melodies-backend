import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

// Hash password trước khi lưu
userSchema.pre('save', async function (next) {
  // Chỉ hash password nếu nó được modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method để so sánh password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Index để tìm kiếm nhanh hơn
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
