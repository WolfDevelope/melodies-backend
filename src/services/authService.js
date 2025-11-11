import User from '../models/User.js';
import emailService from './emailService.js';

class AuthService {
  /**
   * Đăng ký người dùng mới
   */
  async register(userData) {
    try {
      // Kiểm tra email đã tồn tại chưa
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email đã được sử dụng');
      }

      // Tạo user mới
      const user = new User({
        email: userData.email,
        password: userData.password, // Trong production nên hash password
        name: userData.name,
        birthday: userData.birthday,
        gender: userData.gender,
        marketingConsent: userData.marketingConsent || false,
        dataSharing: userData.dataSharing || false,
        isEmailVerified: true, // Đã verify từ signup flow
      });

      // Lưu vào database
      await user.save();
      
      // Gửi welcome email
      await emailService.sendWelcomeEmail(user.email, user.name);

      // Trả về user (không bao gồm password)
      const userObject = user.toObject();
      delete userObject.password;

      return {
        success: true,
        message: 'Đăng ký thành công',
        user: userObject,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đăng nhập
   */
  async login(email, password) {
    try {
      // Tìm user theo email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Email không tồn tại');
      }

      // Kiểm tra password (trong production nên dùng bcrypt.compare)
      if (user.password !== password) {
        throw new Error('Mật khẩu không chính xác');
      }

      // Cập nhật lastLogin
      user.lastLogin = new Date();
      await user.save();

      // Trả về user (không bao gồm password)
      const userObject = user.toObject();
      delete userObject.password;

      return {
        success: true,
        message: 'Đăng nhập thành công',
        user: userObject,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Kiểm tra email đã tồn tại chưa
   */
  async checkEmailExists(email) {
    try {
      const user = await User.findOne({ email });
      return {
        exists: !!user,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy thông tin user theo ID
   */
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        throw new Error('Không tìm thấy người dùng');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gửi OTP xác thực email
   * Lưu OTP trong memory cache, KHÔNG tạo user trong DB
   */
  async sendOTP(email, name) {
    try {
      console.log('🔍 [sendOTP] Starting OTP send for:', email);
      
      // Kiểm tra email đã tồn tại trong DB chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('❌ [sendOTP] Email already exists:', email);
        throw new Error('Email đã được sử dụng');
      }
      console.log('✅ [sendOTP] Email available');

      // Tạo OTP mới
      const otp = emailService.generateOTP();
      console.log('✅ [sendOTP] OTP generated:', otp);
      
      // Lưu OTP vào cache (không lưu DB)
      emailService.saveOTP(email, otp);
      console.log('✅ [sendOTP] OTP saved to cache');

      // Gửi email
      console.log('📧 [sendOTP] Attempting to send email...');
      await emailService.sendVerificationEmail(email, otp, name);
      console.log('✅ [sendOTP] Email sent successfully');

      return {
        success: true,
        message: 'Mã OTP đã được gửi đến email của bạn',
      };
    } catch (error) {
      console.error('❌ [sendOTP] Error:', error.message);
      console.error('❌ [sendOTP] Stack:', error.stack);
      throw error;
    }
  }

  /**
   * Xác thực OTP từ cache
   */
  async verifyOTP(email, otp) {
    try {
      // Lấy OTP từ cache
      const cachedOTP = emailService.getOTP(email);
      
      if (!cachedOTP) {
        throw new Error('Vui lòng yêu cầu gửi mã OTP mới');
      }

      // Kiểm tra OTP đã hết hạn chưa
      if (cachedOTP.expires < new Date()) {
        emailService.deleteOTP(email);
        throw new Error('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới');
      }

      // Kiểm tra OTP có đúng không
      if (cachedOTP.otp !== otp) {
        throw new Error('Mã OTP không chính xác');
      }

      // Xác thực thành công - Xóa OTP khỏi cache
      emailService.deleteOTP(email);

      return {
        success: true,
        message: 'Xác thực email thành công',
        email: email,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gửi lại OTP
   */
  async resendOTP(email) {
    try {
      // Kiểm tra email đã tồn tại trong DB chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email đã được sử dụng');
      }

      // Tạo OTP mới
      const otp = emailService.generateOTP();
      
      // Lưu OTP vào cache
      emailService.saveOTP(email, otp);

      // Gửi email
      await emailService.sendVerificationEmail(email, otp, 'bạn');

      return {
        success: true,
        message: 'Mã OTP mới đã được gửi đến email của bạn',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật thông tin người dùng
   */
  async updateProfile(userId, updateData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Không tìm thấy người dùng');
      }

      // Kiểm tra nếu email mới đã được sử dụng bởi người khác
      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await User.findOne({ email: updateData.email });
        if (existingUser) {
          throw new Error('Email đã được sử dụng');
        }
      }

      // Cập nhật các trường được phép
      if (updateData.name) user.name = updateData.name;
      if (updateData.email) user.email = updateData.email;
      if (updateData.gender) user.gender = updateData.gender;
      if (updateData.birthday) user.birthday = updateData.birthday;
      if (updateData.country) user.country = updateData.country;

      await user.save();

      return {
        success: true,
        message: 'Cập nhật thông tin thành công',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          gender: user.gender,
          birthday: user.birthday,
          country: user.country,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa tài khoản người dùng
   */
  async deleteAccount(userId, password) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Không tìm thấy người dùng');
      }

      // Xác thực mật khẩu trước khi xóa
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Mật khẩu không chính xác');
      }

      // Xóa user khỏi database
      await User.findByIdAndDelete(userId);

      return {
        success: true,
        message: 'Tài khoản đã được xóa thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đổi mật khẩu
   */
  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Không tìm thấy người dùng');
      }

      // Xác thực mật khẩu cũ
      const isPasswordValid = await user.comparePassword(oldPassword);
      if (!isPasswordValid) {
        throw new Error('Mật khẩu cũ không chính xác');
      }

      // Cập nhật mật khẩu mới
      user.password = newPassword;
      await user.save();

      return {
        success: true,
        message: 'Đổi mật khẩu thành công',
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
