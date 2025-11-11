import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    // OTP cache để lưu tạm OTP (email -> {otp, expires})
    this.otpCache = new Map();
    this._transporter = null; // Lazy initialization
  }
  
  /**
   * Lấy transporter (tạo nếu chưa có)
   */
  getTransporter() {
    if (!this._transporter) {
      console.log('🔧 [EmailService] Creating transporter...');
      console.log('   EMAIL_USER:', process.env.EMAIL_USER);
      console.log('   EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);
      console.log('   EMAIL_PASSWORD length:', process.env.EMAIL_PASSWORD?.length);
      
      this._transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      
      console.log('✅ [EmailService] Transporter created successfully');
    }
    return this._transporter;
  }
  
  /**
   * Generate random 6-digit OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  /**
   * Lưu OTP vào cache
   */
  saveOTP(email, otp) {
    this.otpCache.set(email, {
      otp,
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 phút
    });
  }
  
  /**
   * Lấy OTP từ cache
   */
  getOTP(email) {
    return this.otpCache.get(email);
  }
  
  /**
   * Xóa OTP khỏi cache
   */
  deleteOTP(email) {
    this.otpCache.delete(email);
  }

  /**
   * Send OTP verification email
   * @param {string} email - Recipient email
   * @param {string} otp - 6-digit OTP code
   * @param {string} name - User name
   */
  async sendVerificationEmail(email, otp, name = 'bạn') {
    console.log('📧 [EmailService] Preparing to send email to:', email);
    console.log('📧 [EmailService] EMAIL_USER:', process.env.EMAIL_USER);
    console.log('📧 [EmailService] EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);
    
    const mailOptions = {
      from: `"Melodies" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Xác thực tài khoản Melodies',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 32px;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .content p {
              color: #333333;
              font-size: 16px;
              line-height: 1.6;
              margin: 0 0 20px 0;
            }
            .otp-box {
              background-color: #f8f9fa;
              border: 2px dashed #ec4899;
              border-radius: 8px;
              padding: 20px;
              margin: 30px 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              color: #ec4899;
              letter-spacing: 8px;
              margin: 10px 0;
            }
            .expiry {
              color: #666666;
              font-size: 14px;
              margin-top: 10px;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #666666;
              font-size: 12px;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              text-align: left;
            }
            .warning p {
              margin: 0;
              color: #856404;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Melodies</h1>
            </div>
            <div class="content">
              <p>Xin chào <strong>${name}</strong>,</p>
              <p>Cảm ơn bạn đã đăng ký tài khoản Melodies! 🎵</p>
              <p>Để hoàn tất đăng ký, vui lòng nhập mã xác thực sau:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="expiry">Mã có hiệu lực trong 10 phút</div>
              </div>

              <div class="warning">
                <p><strong>⚠️ Lưu ý bảo mật:</strong></p>
                <p>• Không chia sẻ mã này với bất kỳ ai</p>
                <p>• Melodies sẽ không bao giờ yêu cầu mã qua điện thoại hoặc email</p>
                <p>• Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email</p>
              </div>
            </div>
            <div class="footer">
              <p>Email này được gửi tự động, vui lòng không trả lời.</p>
              <p>&copy; 2024 Melodies. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      console.log('🚀 [EmailService] Sending email...');
      const transporter = this.getTransporter();
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ [EmailService] Email sent successfully! MessageId:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ [EmailService] Error sending email:', error.message);
      console.error('❌ [EmailService] Error code:', error.code);
      console.error('❌ [EmailService] Full error:', error);
      throw new Error('Không thể gửi email xác thực');
    }
  }

  /**
   * Send welcome email after successful verification
   * @param {string} email - User email
   * @param {string} name - User name
   */
  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: `"Melodies" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Chào mừng đến với Melodies! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 32px; }
            .content { padding: 40px 30px; }
            .content p { color: #333333; font-size: 16px; line-height: 1.6; }
            .cta-button { display: inline-block; background-color: #ec4899; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Chào mừng!</h1>
            </div>
            <div class="content">
              <p>Xin chào <strong>${name}</strong>,</p>
              <p>Tài khoản của bạn đã được xác thực thành công! 🎵</p>
              <p>Bây giờ bạn có thể bắt đầu khám phá hàng triệu bài hát, tạo playlist yêu thích và chia sẻ âm nhạc với bạn bè.</p>
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/login" class="cta-button">Bắt đầu nghe nhạc</a>
              </div>
              <p>Chúc bạn có những trải nghiệm tuyệt vời cùng Melodies!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      const transporter = this.getTransporter();
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Không throw error vì đây không phải critical
    }
  }
}

export default new EmailService();