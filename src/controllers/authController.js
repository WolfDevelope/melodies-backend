import authService from '../services/authService.js';

class AuthController {
  /**
   * POST /api/auth/register
   * Đăng ký tài khoản mới
   */
  async register(req, res) {
    try {
      const { email, password, name, birthday, gender, marketingConsent, dataSharing } = req.body;

      // Validate dữ liệu
      if (!email || !password || !name || !birthday || !gender) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        });
      }

      // Validate password length
      if (password.length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu phải có ít nhất 10 ký tự',
        });
      }

      // Gọi service để xử lý logic
      const result = await authService.register({
        email,
        password,
        name,
        birthday,
        gender,
        marketingConsent,
        dataSharing,
      });

      return res.status(201).json(result);
    } catch (error) {
      console.error('Register error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Đăng ký thất bại',
      });
    }
  }

  /**
   * POST /api/auth/login
   * Đăng nhập
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate dữ liệu
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập email và mật khẩu',
        });
      }

      // Gọi service để xử lý logic
      const result = await authService.login(email, password);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Login error:', error);
      return res.status(401).json({
        success: false,
        message: error.message || 'Đăng nhập thất bại',
      });
    }
  }

  /**
   * POST /api/auth/check-email
   * Kiểm tra email đã tồn tại chưa
   */
  async checkEmail(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email là bắt buộc',
        });
      }

      const result = await authService.checkEmailExists(email);

      return res.status(200).json({
        success: true,
        exists: result.exists,
      });
    } catch (error) {
      console.error('Check email error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi kiểm tra email',
      });
    }
  }

  /**
   * GET /api/auth/me
   * Lấy thông tin user hiện tại
   */
  async getMe(req, res) {
    try {
      const userId = req.user?.id; // Từ middleware authentication

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Chưa đăng nhập',
        });
      }

      const user = await authService.getUserById(userId);

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error('Get me error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi lấy thông tin người dùng',
      });
    }
  }

  /**
   * POST /api/auth/send-otp
   * Gửi mã OTP xác thực email
   */
  async sendOTP(req, res) {
    try {
      const { email, name } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email là bắt buộc',
        });
      }

      const result = await authService.sendOTP(email, name || 'bạn');

      return res.status(200).json(result);
    } catch (error) {
      console.error('Send OTP error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Không thể gửi mã OTP',
      });
    }
  }

  /**
   * POST /api/auth/verify-otp
   * Xác thực mã OTP
   */
  async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Email và mã OTP là bắt buộc',
        });
      }

      const result = await authService.verifyOTP(email, otp);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Verify OTP error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Xác thực OTP thất bại',
      });
    }
  }

  /**
   * POST /api/auth/resend-otp
   * Gửi lại mã OTP
   */
  async resendOTP(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email là bắt buộc',
        });
      }

      const result = await authService.resendOTP(email);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Resend OTP error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Không thể gửi lại mã OTP',
      });
    }
  }

  /**
   * PUT /api/auth/profile
   * Cập nhật thông tin người dùng
   */
  async updateProfile(req, res) {
    try {
      // Tạm thời lấy userId từ body hoặc email để tìm user
      const { userId, email, newEmail, name, gender, birthday, country } = req.body;

      if (!userId && !email) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin userId hoặc email',
        });
      }

      // Nếu không có userId, tìm user bằng email (email cũ)
      let userIdToUpdate = userId;
      if (!userIdToUpdate && email) {
        const User = (await import('../models/User.js')).default;
        const user = await User.findOne({ email });
        if (user) {
          userIdToUpdate = user._id;
        }
      }

      if (!userIdToUpdate) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng',
        });
      }

      // Sử dụng newEmail nếu có (khi thay đổi email), nếu không dùng email cũ
      const emailToUpdate = newEmail || email;

      const result = await authService.updateProfile(userIdToUpdate, {
        name,
        email: emailToUpdate,
        gender,
        birthday,
        country,
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Không thể cập nhật thông tin',
      });
    }
  }

  /**
   * DELETE /api/auth/account
   * Xóa tài khoản người dùng
   */
  async deleteAccount(req, res) {
    try {
      // Tạm thời lấy userId hoặc email từ body
      const { userId, email, password } = req.body;

      if (!userId && !email) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin userId hoặc email',
        });
      }

      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập mật khẩu để xác nhận',
        });
      }

      // Nếu không có userId, tìm user bằng email
      let userIdToDelete = userId;
      if (!userIdToDelete && email) {
        const User = (await import('../models/User.js')).default;
        const user = await User.findOne({ email });
        if (user) {
          userIdToDelete = user._id;
        }
      }

      if (!userIdToDelete) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng',
        });
      }

      const result = await authService.deleteAccount(userIdToDelete, password);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Delete account error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Không thể xóa tài khoản',
      });
    }
  }

  /**
   * PUT /api/auth/change-password
   * Đổi mật khẩu
   */
  async changePassword(req, res) {
    try {
      const userId = req.user?.id; // Lấy từ JWT middleware
      const { oldPassword, newPassword } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Vui lòng đăng nhập',
        });
      }

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ thông tin',
        });
      }

      if (newPassword.length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu mới phải có ít nhất 10 ký tự',
        });
      }

      const result = await authService.changePassword(userId, oldPassword, newPassword);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Change password error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Không thể đổi mật khẩu',
      });
    }
  }
}

export default new AuthController();
