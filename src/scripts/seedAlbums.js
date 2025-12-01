import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Album from '../models/Album.js';
import connectDB from '../config/database.js';

const sampleAlbums = [
  {
    title: 'M-TP Ambition',
    artist: 'Sơn Tùng M-TP',
    genre: 'Pop',
    releaseDate: '2017-07-01',
    totalTracks: 10,
    description: 'Album đầu tay của Sơn Tùng M-TP với những ca khúc hit như Lạc Trôi, Nơi Này Có Anh.',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500',
    plays: 15234567,
    likes: 234567,
    status: 'active',
  },
  {
    title: 'Tâm 9',
    artist: 'Mỹ Tâm',
    genre: 'Ballad',
    releaseDate: '2015-12-12',
    totalTracks: 12,
    description: 'Album thứ 9 của Mỹ Tâm với những ca khúc ballad sâu lắng.',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
    plays: 8765432,
    likes: 156789,
    status: 'active',
  },
  {
    title: 'Ai Cũng Phải Bắt Đầu Từ Đâu Đó',
    artist: 'Đen Vâu',
    genre: 'Rap',
    releaseDate: '2016-05-20',
    totalTracks: 8,
    description: 'Album đầu tay của Đen Vâu với phong cách rap kể chuyện độc đáo.',
    coverImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500',
    plays: 12345678,
    likes: 198765,
    status: 'active',
  },
  {
    title: 'Hoàng',
    artist: 'Hoàng Thùy Linh',
    genre: 'Pop',
    releaseDate: '2019-08-15',
    totalTracks: 9,
    description: 'Album đánh dấu sự trở lại mạnh mẽ của Hoàng Thùy Linh.',
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500',
    plays: 6543210,
    likes: 87654,
    status: 'active',
  },
  {
    title: 'Bigcityboi',
    artist: 'Binz',
    genre: 'Rap',
    releaseDate: '2019-11-01',
    totalTracks: 7,
    description: 'Album solo đầu tiên của Binz với hit Bigcityboi nổi tiếng.',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
    plays: 9876543,
    likes: 145678,
    status: 'active',
  },
  {
    title: 'Chạy Ngay Đi',
    artist: 'Sơn Tùng M-TP',
    genre: 'EDM',
    releaseDate: '2018-05-01',
    totalTracks: 5,
    description: 'Mini album với hit Chạy Ngay Đi gây sốt.',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500',
    plays: 18765432,
    likes: 287654,
    status: 'active',
  },
  {
    title: 'Truyền Thuyết',
    artist: 'Mỹ Tâm',
    genre: 'Ballad',
    releaseDate: '2013-10-10',
    totalTracks: 11,
    description: 'Album ballad đầy cảm xúc của Mỹ Tâm.',
    coverImage: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500',
    plays: 5432109,
    likes: 76543,
    status: 'active',
  },
  {
    title: 'Ngày Chưa Giông Bão',
    artist: 'Đen Vâu',
    genre: 'Rap',
    releaseDate: '2020-03-15',
    totalTracks: 10,
    description: 'Album mới nhất của Đen Vâu với nhiều ca khúc ý nghĩa.',
    coverImage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500',
    plays: 11234567,
    likes: 176543,
    status: 'active',
  },
];

const seedAlbums = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing albums
    await Album.deleteMany({});
    console.log('🗑️  Cleared existing albums');

    // Insert sample albums
    const albums = await Album.insertMany(sampleAlbums);
    console.log(`✅ Seeded ${albums.length} albums successfully`);

    // Display seeded albums
    albums.forEach((album, index) => {
      console.log(`${index + 1}. ${album.title} - ${album.artist} (${album.totalTracks} tracks) (ID: ${album._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding albums:', error);
    process.exit(1);
  }
};

seedAlbums();
