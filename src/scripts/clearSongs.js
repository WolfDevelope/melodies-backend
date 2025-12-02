import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Song from '../models/Song.js';

dotenv.config();

const clearSongs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all songs
    const result = await Song.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} songs`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing songs:', error);
    process.exit(1);
  }
};

clearSongs();
