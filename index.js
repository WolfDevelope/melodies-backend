// Load biến môi trường ĐẦU TIÊN - TRƯỚC KHI IMPORT BẤT KỊ THỨ GÌ
import dotenv from 'dotenv';
dotenv.config();

// Sau khi load .env, mới import các module khác
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './src/config/database.js';
import routes from './src/routes/index.js';
import errorHandler from './src/middleware/errorHandler.js';

// Kết nối MongoDB
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads');
const audioUploadsDir = path.join(uploadsDir, 'audio');
fs.mkdirSync(audioUploadsDir, { recursive: true });

// Middleware
// CORS configuration - Allow all origins in development
app.use(cors({
  origin: '*', // Allow all origins (for development)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // Đọc JSON từ body request
app.use(express.urlencoded({ extended: true })); // Đọc form data

app.use('/uploads', express.static(uploadsDir));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Melodies API is running...',
    version: '1.0.0',
  });
});

// API routes
app.use('/api', routes);

// Error handler (phải đặt sau tất cả routes)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route không tồn tại',
  });
});

// Cổng chạy server (lấy từ .env hoặc mặc định 5000)
const PORT = process.env.PORT || 5000;

// Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
