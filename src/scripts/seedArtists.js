import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Artist from '../models/Artist.js';
import connectDB from '../config/database.js';

const sampleArtists = [
  {
    name: 'Sơn Tùng M-TP',
    genre: 'Pop',
    bio: 'Ca sĩ, nhạc sĩ, rapper người Việt Nam. Anh được biết đến là một trong những nghệ sĩ có ảnh hưởng nhất trong làng nhạc Việt.',
    verified: true,
    totalSongs: 45,
    totalAlbums: 3,
    followers: 5234567,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100',
  },
  {
    name: 'Mỹ Tâm',
    genre: 'Ballad',
    bio: 'Ca sĩ, nhạc sĩ, diễn viên người Việt Nam. Được mệnh danh là "Họa mi tóc nâu" của làng nhạc Việt.',
    verified: true,
    totalSongs: 120,
    totalAlbums: 15,
    followers: 3456789,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    name: 'Đen Vâu',
    genre: 'Rap',
    bio: 'Rapper, nhạc sĩ người Việt Nam. Được biết đến với phong cách rap kể chuyện độc đáo.',
    verified: true,
    totalSongs: 38,
    totalAlbums: 2,
    followers: 2345678,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    name: 'Hòa Minzy',
    genre: 'Pop',
    bio: 'Ca sĩ người Việt Nam, từng là thành viên nhóm nhạc The Bells.',
    verified: true,
    totalSongs: 52,
    totalAlbums: 4,
    followers: 1876543,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  },
  {
    name: 'Binz',
    genre: 'Rap',
    bio: 'Rapper, ca sĩ người Việt Nam. Thành viên nhóm nhạc SpaceSpeakers.',
    verified: true,
    totalSongs: 28,
    totalAlbums: 2,
    followers: 1654321,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  },
  {
    name: 'Chi Pu',
    genre: 'Pop',
    bio: 'Ca sĩ, diễn viên người Việt Nam.',
    verified: false,
    totalSongs: 15,
    totalAlbums: 1,
    followers: 987654,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
  },
];

const seedArtists = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing artists
    await Artist.deleteMany({});
    console.log('🗑️  Cleared existing artists');

    // Insert sample artists
    const artists = await Artist.insertMany(sampleArtists);
    console.log(`✅ Seeded ${artists.length} artists successfully`);

    // Display seeded artists
    artists.forEach((artist, index) => {
      console.log(`${index + 1}. ${artist.name} - ${artist.genre} (ID: ${artist._id}) ${artist.verified ? '✓' : ''}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding artists:', error);
    process.exit(1);
  }
};

seedArtists();
