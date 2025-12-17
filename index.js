// Load biến môi trường ĐẦU TIÊN - TRƯỚC KHI IMPORT BẤT KỊ THỨ GÌ
import dotenv from 'dotenv';
dotenv.config();

// Sau khi load .env, mới import các module khác
import connectDB from './src/config/database.js';
import app from './src/app.js';

// Kết nối MongoDB
connectDB();

// Cổng chạy server (lấy từ .env hoặc mặc định 5000)
const PORT = process.env.PORT || 5000;

// Khởi động server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}
