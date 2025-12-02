import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';

dotenv.config();

const categories = [
  {
    name: 'Bài Hát Mới Phát Hành',
    slug: 'bai-hat-moi-phat-hanh',
    description: 'Những bài hát mới nhất được phát hành trong tuần',
    type: 'playlist',
    contentType: 'songs',
    icon: '🆕',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    order: 1,
    isActive: true,
    isFeatured: true,
    showOnHomepage: true,
    homepageTitle: 'Mới phát hành dành cho bạn',
    homepageOrder: 1,
    metadata: {
      color: '#FF1493',
      tags: ['new', 'trending', 'latest'],
      autoUpdate: true,
      updateFrequency: 'weekly',
    },
  },
  {
    name: 'Nghệ Sĩ Mới Nổi',
    slug: 'nghe-si-moi-noi',
    description: 'Khám phá những nghệ sĩ tài năng mới',
    type: 'playlist',
    contentType: 'songs',
    icon: '⭐',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    order: 2,
    isActive: true,
    isFeatured: true,
    showOnHomepage: true,
    homepageTitle: 'Đề xuất cho bạn',
    homepageOrder: 2,
    metadata: {
      color: '#FFD700',
      tags: ['new-artist', 'emerging', 'talent'],
      autoUpdate: false,
      updateFrequency: 'monthly',
    },
  },
  {
    name: 'Top 10 Trong Tuần',
    slug: 'top-10-trong-tuan',
    description: '10 bài hát được nghe nhiều nhất trong tuần',
    type: 'chart',
    contentType: 'songs',
    icon: '🔥',
    coverImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    order: 3,
    isActive: true,
    isFeatured: true,
    showOnHomepage: true,
    homepageTitle: 'Bảng xếp hạng nổi bật',
    homepageOrder: 3,
    metadata: {
      color: '#FF4500',
      tags: ['top', 'chart', 'popular', 'weekly'],
      autoUpdate: true,
      updateFrequency: 'weekly',
    },
  },
  {
    name: 'Album Thịnh Hành',
    slug: 'album-thinh-hanh',
    description: 'Những album đang được yêu thích nhất',
    type: 'playlist',
    contentType: 'songs',
    icon: '💿',
    coverImage: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800',
    order: 4,
    isActive: true,
    isFeatured: true,
    showOnHomepage: true,
    homepageTitle: 'Album mà bạn có thể thích',
    homepageOrder: 4,
    metadata: {
      color: '#9370DB',
      tags: ['album', 'trending', 'popular'],
      autoUpdate: true,
      updateFrequency: 'weekly',
    },
  },
  {
    name: 'Thiên Hạ Nghe Gì',
    slug: 'thien-ha-nghe-gi',
    description: 'Những bài hát đang được mọi người nghe nhiều nhất',
    type: 'chart',
    contentType: 'songs',
    icon: '🌍',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
    order: 5,
    isActive: true,
    isFeatured: true,
    showOnHomepage: true,
    homepageTitle: 'Đang thịnh hành',
    homepageOrder: 5,
    metadata: {
      color: '#00CED1',
      tags: ['global', 'trending', 'popular'],
      autoUpdate: true,
      updateFrequency: 'daily',
    },
  },
  {
    name: 'Nhạc Việt Hay Nhất',
    slug: 'nhac-viet-hay-nhat',
    description: 'Tuyển tập những bài hát Việt Nam hay nhất',
    type: 'playlist',
    contentType: 'songs',
    icon: '🇻🇳',
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    order: 6,
    isActive: true,
    isFeatured: false,
    metadata: {
      color: '#DA251D',
      tags: ['vietnamese', 'vpop', 'best'],
      autoUpdate: false,
      updateFrequency: 'manual',
    },
  },
  {
    name: 'Nhạc Quốc Tế Hot',
    slug: 'nhac-quoc-te-hot',
    description: 'Những bản hit quốc tế đang làm mưa làm gió',
    type: 'playlist',
    contentType: 'songs',
    icon: '🌟',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    order: 7,
    isActive: true,
    isFeatured: false,
    metadata: {
      color: '#1E90FF',
      tags: ['international', 'kpop', 'usuk', 'hot'],
      autoUpdate: true,
      updateFrequency: 'weekly',
    },
  },
  {
    name: 'Nhạc Thư Giãn',
    slug: 'nhac-thu-gian',
    description: 'Những giai điệu nhẹ nhàng giúp thư giãn',
    type: 'mood',
    contentType: 'songs',
    icon: '😌',
    coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800',
    order: 8,
    isActive: true,
    isFeatured: false,
    metadata: {
      color: '#98D8C8',
      tags: ['chill', 'relax', 'calm', 'peaceful'],
      autoUpdate: false,
      updateFrequency: 'manual',
    },
  },
  {
    name: 'Nhạc Tập Gym',
    slug: 'nhac-tap-gym',
    description: 'Những bản nhạc sôi động cho buổi tập luyện',
    type: 'activity',
    contentType: 'songs',
    icon: '💪',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    order: 9,
    isActive: true,
    isFeatured: false,
    metadata: {
      color: '#FF6347',
      tags: ['workout', 'gym', 'energy', 'motivation'],
      autoUpdate: false,
      updateFrequency: 'manual',
    },
  },
  {
    name: 'Nhạc Buồn Tâm Trạng',
    slug: 'nhac-buon-tam-trang',
    description: 'Những bài hát buồn chạm đến trái tim',
    type: 'mood',
    contentType: 'songs',
    icon: '💔',
    coverImage: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=800',
    order: 10,
    isActive: true,
    isFeatured: false,
    metadata: {
      color: '#708090',
      tags: ['sad', 'emotional', 'heartbreak', 'mood'],
      autoUpdate: false,
      updateFrequency: 'manual',
    },
  },
];

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    // Insert new categories
    await Category.insertMany(categories);
    console.log(`✅ Successfully seeded ${categories.length} categories`);

    // Display seeded categories
    console.log('\n📋 Seeded Categories:');
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.icon} ${cat.name} (${cat.type})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
