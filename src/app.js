import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, '..', '..', 'uploads');
const audioUploadsDir = path.join(uploadsDir, 'audio');
try {
  fs.mkdirSync(audioUploadsDir, { recursive: true });
} catch (err) {
  console.error('Failed to create audio upload directory:', {
    audioUploadsDir,
    code: err?.code,
    message: err?.message,
  });
}

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Melodies API is running...',
    version: '1.0.0',
  });
});

app.use('/api', routes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route không tồn tại',
  });
});

export default app;
