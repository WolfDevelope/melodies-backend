# Melodies Backend API

Backend API cho ứng dụng Melodies - Nền tảng nghe nhạc trực tuyến

## 🚀 Công nghệ sử dụng

- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **MVC-S Pattern** - Kiến trúc Model-View-Controller-Service

## 📁 Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/          # Cấu hình (database, etc.)
│   ├── models/          # Mongoose models
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   └── middleware/      # Custom middleware
├── .env.example         # Environment variables template
├── index.js             # Entry point
└── package.json
```

## 🛠️ Cài đặt

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong file `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/melodies
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Cài đặt MongoDB

**Windows:**
- Tải MongoDB Community Server từ: https://www.mongodb.com/try/download/community
- Cài đặt và chạy MongoDB service
- Hoặc sử dụng MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 4. Chạy server

**Development mode (với nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📡 API Endpoints

### Authentication

#### 1. Đăng ký tài khoản
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123456",
  "name": "Nguyễn Văn A",
  "birthday": "15/03/2000",
  "gender": "male",
  "marketingConsent": false,
  "dataSharing": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "name": "Nguyễn Văn A",
    "birthday": "15/03/2000",
    "gender": "male",
    "marketingConsent": false,
    "dataSharing": false,
    "isActive": true,
    "createdAt": "2025-11-07T...",
    "updatedAt": "2025-11-07T..."
  }
}
```

#### 2. Đăng nhập
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "name": "Nguyễn Văn A",
    "lastLogin": "2025-11-07T..."
  }
}
```

#### 3. Kiểm tra email
```http
POST /api/auth/check-email
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "exists": true
}
```

#### 4. Lấy thông tin user hiện tại
```http
GET /api/auth/me
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "name": "Nguyễn Văn A"
  }
}
```

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2025-11-07T..."
}
```

## 🔒 Validation Rules

### User Registration
- **Email**: Bắt buộc, phải là email hợp lệ, unique
- **Password**: Bắt buộc, tối thiểu 10 ký tự
- **Name**: Bắt buộc
- **Birthday**: Bắt buộc, format: DD/MM/YYYY
- **Gender**: Bắt buộc, enum: ['male', 'female', 'non-binary', 'prefer-not-to-say']
- **marketingConsent**: Boolean, mặc định false
- **dataSharing**: Boolean, mặc định false

## 🗄️ Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (required, min: 10),
  name: String (required),
  birthday: String (required),
  gender: String (required, enum),
  marketingConsent: Boolean (default: false),
  dataSharing: Boolean (default: false),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🧪 Testing với Postman/Thunder Client

### 1. Test đăng ký
```bash
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "email": "test@melodies.com",
  "password": "test123456",
  "name": "Test User",
  "birthday": "01/01/2000",
  "gender": "male"
}
```

### 2. Test đăng nhập
```bash
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "test@melodies.com",
  "password": "test123456"
}
```

## 📝 Notes

- **Password Security**: Hiện tại password đang lưu plain text. Trong production cần hash với bcrypt
- **JWT Authentication**: Chưa implement JWT, cần thêm middleware authentication
- **Input Validation**: Đã có validation cơ bản, có thể thêm express-validator
- **Error Handling**: Đã có global error handler
- **CORS**: Đã enable cho tất cả origins, trong production nên giới hạn

## 🔜 TODO

- [ ] Implement JWT authentication
- [ ] Hash password với bcrypt
- [ ] Add refresh token
- [ ] Add email verification
- [ ] Add password reset
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Add unit tests
- [ ] Add API documentation (Swagger)

## 📞 Support

Nếu có vấn đề, vui lòng tạo issue hoặc liên hệ team phát triển.
