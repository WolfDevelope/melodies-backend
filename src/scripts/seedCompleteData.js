import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import Song from '../models/Song.js';
import Category from '../models/Category.js';

dotenv.config();

const genres = ['Pop', 'Ballad', 'Rock', 'EDM', 'R&B', 'Rap', 'Jazz', 'Classical'];

// Vietnamese artist names
const artistNames = [
  'Sơn Tùng M-TP', 'Hòa Minzy', 'Đen Vâu', 'Bích Phương', 'Noo Phước Thịnh',
  'Mỹ Tâm', 'Đức Phúc', 'Erik', 'Min', 'Hoàng Thùy Linh',
  'Jack', 'Amee', 'Vũ Cát Tường', 'Hương Ly', 'Chi Pu',
  'Karik', 'Suboi', 'Binz', 'Rhymastic', 'Wren Evans'
];

// Song title templates
const songTitles = [
  'Chúng Ta Của Hiện Tại', 'Lạc Trôi', 'Nơi Này Có Anh', 'Anh Ơi Ở Lại',
  'Bùa Yêu', 'Có Chắc Yêu Là Đây', 'Hãy Trao Cho Anh', 'Sao Anh Chưa Say',
  'Em Của Ngày Hôm Qua', 'Yêu Một Người Có Lẽ', 'Người Lạ Ơi', 'Anh Là Ngoại Lệ',
  'Đừng Làm Trái Tim Anh Đau', 'Thằng Điên', 'Chạy Ngay Đi', 'Bống Bống Bang Bang',
  'Mơ', 'Đi Để Trở Về', 'Hoa Hải Đường', 'Như Anh Đã Thấy Em',
  'Sóng Gió', 'Đếm Cừu', 'Có Em Chờ', 'Anh Đang Ở Đâu Đấy Anh',
  'Tình Đầu Quá Chén', 'Phía Sau Một Cô Gái', 'Cưới Thôi', 'Một Nhà',
  'Rồi Tới Luôn', 'Bạc Phận', 'Anh Thanh Niên', 'Yêu Đơn Phương',
  'Tháng Năm', 'Cô Đơn Trên Sofa', 'Đã Lỡ Yêu Em Nhiều', 'Chẳng Thể Tìm Được Em',
  'Hơn Cả Yêu', 'Từng Quen', 'Vì Yêu Cứ Đâm Đầu', 'Anh Nhà Ở Đâu Thế',
  'Tình Yêu Màu Nắng', 'Cô Gái M52', 'Sài Gòn Đau Lòng Quá', 'Đường Tôi Chở Em Về',
  'Anh Đã Quen Với Cô Đơn', 'Người Âm Phủ', 'Hết Thương Cạn Nhớ', 'Buồn Của Anh',
  'Có Hẹn Với Thanh Xuân', 'Anh Không Đòi Quà'
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    console.log('\n🗑️  Clearing old data...');
    await Promise.all([
      Song.deleteMany({}),
      Album.deleteMany({}),
      Artist.deleteMany({}),
      Category.deleteMany({}),
    ]);
    console.log('✅ Old data cleared');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
};

const seedData = async () => {
  try {
    console.log('\n🌱 Starting to seed data...\n');

    // 1. Create Artists
    console.log('👤 Creating artists...');
    const artistsData = artistNames.map((name, index) => ({
      name,
      genre: genres[index % genres.length],
      bio: `${name} là một nghệ sĩ tài năng trong làng nhạc Việt với phong cách ${genres[index % genres.length]} độc đáo.`,
      avatar: `https://i.pravatar.cc/300?img=${index + 1}`,
      image: `https://i.pravatar.cc/500?img=${index + 1}`,
      verified: index < 10, // First 10 artists are verified
      followers: Math.floor(Math.random() * 1000000) + 10000,
      status: 'active',
      songs: [], // Will be populated later
    }));

    const artists = await Artist.insertMany(artistsData);
    console.log(`✅ Created ${artists.length} artists`);

    // 2. Create Albums (10 albums, each with 5 songs)
    console.log('\n💿 Creating albums...');
    const albumsData = [];
    for (let i = 0; i < 10; i++) {
      const artist = artists[i % artists.length];
      albumsData.push({
        title: `Album ${i + 1} - ${artist.name}`,
        artist: artist._id,
        genre: artist.genre,
        releaseDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1),
        description: `Album tuyển tập những ca khúc hay nhất của ${artist.name}`,
        coverImage: `https://picsum.photos/seed/album${i}/500/500`,
        totalTracks: 5,
        plays: Math.floor(Math.random() * 5000000),
        likes: Math.floor(Math.random() * 500000),
        status: 'active',
        songs: [], // Will be populated later
      });
    }

    const albums = await Album.insertMany(albumsData);
    console.log(`✅ Created ${albums.length} albums`);

    // 3. Create Songs (50 songs)
    console.log('\n🎵 Creating songs...');
    const songsData = [];
    
    for (let i = 0; i < 50; i++) {
      const artist = artists[i % artists.length];
      const album = albums[Math.floor(i / 5) % albums.length]; // 5 songs per album
      
      // Generate duration in MM:SS format (2-5 minutes)
      const totalSeconds = Math.floor(Math.random() * 180) + 120; // 120-300 seconds
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      songsData.push({
        title: songTitles[i],
        artist: artist._id,
        album: album._id,
        genre: artist.genre,
        duration: duration,
        releaseDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        thumbnail: `https://picsum.photos/seed/song${i}/300/300`,
        audioUrl: `https://example.com/audio/song${i}.mp3`,
        lyrics: `Lời bài hát ${songTitles[i]}...\n\nĐây là một bài hát tuyệt vời của ${artist.name}`,
        plays: Math.floor(Math.random() * 10000000),
        likes: Math.floor(Math.random() * 1000000),
        status: 'active',
      });
    }

    const songs = await Song.insertMany(songsData);
    console.log(`✅ Created ${songs.length} songs`);

    // 4. Update Artists with their songs and albums
    console.log('\n🔗 Linking songs and albums to artists...');
    for (const artist of artists) {
      const artistSongs = songs.filter(song => song.artist.toString() === artist._id.toString());
      const artistAlbums = albums.filter(album => album.artist.toString() === artist._id.toString());
      
      artist.songs = artistSongs.map(song => song._id);
      artist.albums = artistAlbums.map(album => album._id);
      artist.totalSongs = artistSongs.length;
      artist.totalAlbums = artistAlbums.length;
      await artist.save();
    }
    console.log('✅ Artists updated with songs and albums');

    // 5. Update Albums with their songs
    console.log('\n🔗 Linking songs to albums...');
    for (const album of albums) {
      const albumSongs = songs.filter(song => song.album.toString() === album._id.toString());
      album.songs = albumSongs.map(song => song._id);
      album.totalTracks = albumSongs.length;
      await album.save();
    }
    console.log('✅ Albums updated with songs');

    // 6. Create Categories with new data
    console.log('\n📁 Creating categories...');
    
    const categoriesData = [
      {
        name: 'Top 50 Bài Hát',
        slug: 'top-50-bai-hat',
        type: 'chart',
        contentType: 'songs',
        songs: songs.slice(0, 20).map(s => s._id), // Top 20 songs
        showOnHomepage: true,
        isActive: true,
        order: 1,
      },
      {
        name: 'Nghệ Sĩ Nổi Bật',
        slug: 'nghe-si-noi-bat',
        type: 'custom',
        contentType: 'artists',
        artists: artists.slice(0, 10).map(a => a._id),
        showOnHomepage: true,
        isActive: true,
        order: 2,
      },
      {
        name: 'Album Hot',
        slug: 'album-hot',
        type: 'custom',
        contentType: 'albums',
        albums: albums.map(a => a._id),
        showOnHomepage: true,
        isActive: true,
        order: 3,
      },
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log(`✅ Created ${categories.length} categories`);

    // Print summary
    console.log('\n📊 Summary:');
    console.log('═══════════════════════════════════════');
    console.log(`👤 Artists: ${artists.length}`);
    console.log(`💿 Albums: ${albums.length}`);
    console.log(`🎵 Songs: ${songs.length}`);
    console.log(`📁 Categories: 3`);
    console.log('═══════════════════════════════════════');
    
    console.log('\n🔗 Relationships:');
    console.log(`   • Each artist has ${Math.floor(songs.length / artists.length)}-${Math.ceil(songs.length / artists.length)} songs`);
    console.log(`   • Each album has 5 songs`);
    console.log(`   • All songs are linked to artists and albums`);
    
    console.log('\n✨ Sample Data:');
    console.log('═══════════════════════════════════════');
    const sampleArtist = artists[0];
    const sampleAlbum = albums[0];
    const sampleSong = songs[0];
    
    console.log(`\n👤 Artist: ${sampleArtist.name}`);
    console.log(`   Genre: ${sampleArtist.genre}`);
    console.log(`   Songs: ${sampleArtist.songs.length}`);
    console.log(`   Verified: ${sampleArtist.verified ? '✓' : '✗'}`);
    
    console.log(`\n💿 Album: ${sampleAlbum.title}`);
    console.log(`   Artist: ${sampleArtist.name}`);
    console.log(`   Songs: ${sampleAlbum.songs.length}`);
    
    console.log(`\n🎵 Song: ${sampleSong.title}`);
    console.log(`   Artist: ${sampleArtist.name}`);
    console.log(`   Album: ${sampleAlbum.title}`);
    console.log(`   Genre: ${sampleSong.genre}`);
    
    console.log('\n✅ Seeding completed successfully!');
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

const main = async () => {
  try {
    await connectDB();
    await clearDatabase();
    await seedData();
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
};

main();
