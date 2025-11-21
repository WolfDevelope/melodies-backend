import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Song from '../models/Song.js';
import connectDB from '../config/database.js';

const sampleSongs = [
  {
    title: 'Nơi này có anh',
    artist: 'Sơn Tùng M-TP',
    album: 'Sky Tour',
    genre: 'Pop',
    duration: '4:32',
    releaseDate: new Date('2018-05-01'),
    plays: 1234567,
    likes: 45678,
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100',
  },
  {
    title: 'Lạc trôi',
    artist: 'Sơn Tùng M-TP',
    album: 'M-TP Ambition',
    genre: 'Pop',
    duration: '4:12',
    releaseDate: new Date('2017-01-01'),
    plays: 987654,
    likes: 34567,
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100',
  },
  {
    title: 'Chúng ta của hiện tại',
    artist: 'Sơn Tùng M-TP',
    album: 'Single',
    genre: 'Ballad',
    duration: '5:12',
    releaseDate: new Date('2018-11-01'),
    plays: 876543,
    likes: 23456,
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100',
  },
  {
    title: 'Anh đếch cần gì nhiều ngoài em',
    artist: 'Đen Vâu ft. Thành Đồng',
    album: 'Single',
    genre: 'Rap',
    duration: '4:05',
    releaseDate: new Date('2019-07-15'),
    plays: 654321,
    likes: 12345,
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100',
  },
  {
    title: 'Em của ngày hôm qua',
    artist: 'Sơn Tùng M-TP',
    album: 'Single',
    genre: 'Ballad',
    duration: '4:28',
    releaseDate: new Date('2017-07-17'),
    plays: 543210,
    likes: 11111,
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=100',
  },
];

const seedSongs = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing songs
    await Song.deleteMany({});
    console.log('🗑️  Cleared existing songs');

    // Insert sample songs
    const songs = await Song.insertMany(sampleSongs);
    console.log(`✅ Seeded ${songs.length} songs successfully`);

    // Display seeded songs
    songs.forEach((song, index) => {
      console.log(`${index + 1}. ${song.title} - ${song.artist} (ID: ${song._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding songs:', error);
    process.exit(1);
  }
};

seedSongs();
