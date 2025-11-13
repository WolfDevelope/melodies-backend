import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký tài khoản mới
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/check-email
 * @desc    Kiểm tra email đã tồn tại chưa
 * @access  Public
 */
router.post('/check-email', authController.checkEmail);

/**
 * @route   GET /api/auth/me
 * @desc    Lấy thông tin user hiện tại
 * @access  Private (cần authentication)
 */
router.get('/me', authController.getMe);

/**
 * @route   POST /api/auth/send-otp
 * @desc    Gửi mã OTP xác thực email
 * @access  Public
 */
router.post('/send-otp', authController.sendOTP);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Xác thực mã OTP
 * @access  Public
 */
router.post('/verify-otp', authController.verifyOTP);

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Gửi lại mã OTP
 * @access  Public
 */
router.post('/resend-otp', authController.resendOTP);

/**
 * @route   PUT /api/auth/profile
 * @desc    Cập nhật thông tin người dùng
 * @access  Private (cần authentication)
 */
router.put('/profile', authController.updateProfile);

/**
 * @route   DELETE /api/auth/account
 * @desc    Xóa tài khoản người dùng
 * @access  Private (cần authentication)
 */
router.delete('/account', authController.deleteAccount);

/**
 * @route   POST /api/auth/verify-password-and-send-otp
 * @desc    Xác thực mật khẩu cũ và gửi OTP để đổi mật khẩu
 * @access  Private (cần authentication)
 */
router.post('/verify-password-and-send-otp', authController.verifyPasswordAndSendOTP);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Đổi mật khẩu sau khi xác thực OTP
 * @access  Private (cần authentication)
 */
router.put('/change-password', authController.changePassword);

export default router;
