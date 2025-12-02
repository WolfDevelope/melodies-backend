import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Song from '../models/Song.js';

dotenv.config();

const addSongsToCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all songs
    const allSongs = await Song.find({ status: 'active' });
    console.log(`📊 Found ${allSongs.length} active songs`);

    if (allSongs.length === 0) {
      console.log('⚠️  No songs found. Please run seed:hotsongs first.');
      process.exit(0);
    }

    // Get all categories
    const categories = await Category.find({});
    console.log(`📋 Found ${categories.length} categories`);

    // Add songs to each category based on type
    for (const category of categories) {
      let songsToAdd = [];

      switch (category.slug) {
        case 'bai-hat-moi-phat-hanh':
          // Add 10 newest songs
          songsToAdd = allSongs.slice(0, 10);
          break;

        case 'nghe-si-moi-noi':
          // Add 8 random songs
          songsToAdd = allSongs.sort(() => 0.5 - Math.random()).slice(0, 8);
          break;

        case 'top-10-trong-tuan':
          // Add 10 random songs (in real app, would be by plays)
          songsToAdd = allSongs.slice(0, 10);
          break;

        case 'album-thinh-hanh':
          // Add 12 random songs
          songsToAdd = allSongs.slice(10, 22);
          break;

        case 'thien-ha-nghe-gi':
          // Add 15 random songs
          songsToAdd = allSongs.slice(0, 15);
          break;

        case 'nhac-viet-hay-nhat':
          // Add 20 random songs
          songsToAdd = allSongs.slice(5, 25);
          break;

        case 'nhac-quoc-te-hot':
          // Add all songs (they are US-UK songs)
          songsToAdd = allSongs.slice(0, 20);
          break;

        case 'nhac-thu-gian':
          // Add 15 random songs
          songsToAdd = allSongs.filter(s => s.genre === 'Ballad' || s.genre === 'Pop').slice(0, 15);
          break;

        case 'nhac-tap-gym':
          // Add energetic songs
          songsToAdd = allSongs.filter(s => s.genre === 'EDM' || s.genre === 'Rock' || s.genre === 'Rap').slice(0, 15);
          break;

        case 'nhac-buon-tam-trang':
          // Add ballad songs
          songsToAdd = allSongs.filter(s => s.genre === 'Ballad').slice(0, 12);
          break;

        default:
          songsToAdd = allSongs.slice(0, 10);
      }

      // Update category with songs
      category.songs = songsToAdd.map(song => song._id);
      await category.save();

      console.log(`✅ Added ${songsToAdd.length} songs to "${category.name}"`);
    }

    console.log('\n🎉 Successfully added songs to all categories!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding songs to categories:', error);
    process.exit(1);
  }
};

addSongsToCategories();
