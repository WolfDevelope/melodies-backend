import express from 'express';
import songController from '../controllers/songController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, '..', '..', '..', 'uploads');
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audioUploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeExt = ['.mp3', '.wav', '.flac'].includes(ext) ? ext : '';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const uploadAudio = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (['.mp3', '.wav', '.flac'].includes(ext)) {
      cb(null, true);
      return;
    }
    cb(new Error('Định dạng file không hợp lệ. Chỉ hỗ trợ MP3, WAV, FLAC'));
  },
});

// Public routes
router.get('/', songController.getAllSongs);
router.get('/statistics', songController.getStatistics);
router.post('/upload-audio', uploadAudio.single('file'), (req, res) => {
  const filename = req.file?.filename;
  if (!filename) {
    res.status(400).json({
      success: false,
      message: 'Không tìm thấy file upload',
    });
    return;
  }

  const urlPath = `/uploads/audio/${filename}`;
  res.status(200).json({
    success: true,
    data: {
      audioUrl: urlPath,
    },
  });
});
router.get('/:id', songController.getSongById);
router.post('/:id/play', songController.incrementPlays);
router.post('/:id/like', songController.toggleLike);

// Admin routes (TODO: Add authentication middleware)
router.post('/', songController.createSong);
router.put('/:id', songController.updateSong);
router.delete('/:id', songController.deleteSong);

export default router;
