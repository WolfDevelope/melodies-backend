import dotenv from 'dotenv';
import connectDB from '../src/config/database.js';
import app from '../src/app.js';

dotenv.config();

let dbReadyPromise;
const ensureDb = async () => {
  if (!dbReadyPromise) {
    dbReadyPromise = connectDB();
  }
  return dbReadyPromise;
};

export default async function handler(req, res) {
  try {
    await ensureDb();
    return app(req, res);
  } catch (err) {
    console.error('Vercel handler error:', err);
    return res.status(500).json({
      success: false,
      message: err?.message || 'Internal Server Error',
    });
  }
}
