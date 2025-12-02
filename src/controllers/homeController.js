import * as categoryService from '../services/categoryService.js';
import songService from '../services/songService.js';

/**
 * Get homepage data with featured categories and content
 * @route GET /api/home
 */
export const getHomePageData = async (req, res) => {
  try {
    // Get categories that should be displayed on homepage
    const homepageCategoriesResult = await categoryService.getAllCategories({
      showOnHomepage: true,
      isActive: true,
      limit: 20,
      sortBy: 'homepageOrder',
    });

    // Get featured categories (fallback if no homepage categories)
    const featuredResult = await categoryService.getAllCategories({
      isFeatured: true,
      isActive: true,
      limit: 10,
      sortBy: 'order',
    });

    // Get all active categories for different sections
    const allCategoriesResult = await categoryService.getAllCategories({
      isActive: true,
      limit: 50,
      sortBy: 'order',
    });

    // Get new releases (latest songs)
    const newReleasesResult = await songService.getAllSongs({}, {
      status: 'active',
      limit: 10,
      sortBy: 'releaseDate',
      sortOrder: 'desc',
    });

    // Get trending songs (most played)
    const trendingResult = await songService.getAllSongs({}, {
      status: 'active',
      limit: 10,
      sortBy: 'plays',
      sortOrder: 'desc',
    });

    // Get top songs (most liked)
    const topSongsResult = await songService.getAllSongs({}, {
      status: 'active',
      limit: 10,
      sortBy: 'likes',
      sortOrder: 'desc',
    });

    // Organize categories by type
    const allCategories = allCategoriesResult.categories || [];
    const categoriesByType = {
      playlists: allCategories.filter(cat => cat.type === 'playlist' && cat.contentType === 'songs'),
      charts: allCategories.filter(cat => cat.type === 'chart'),
      genres: allCategories.filter(cat => cat.type === 'genre'),
      moods: allCategories.filter(cat => cat.type === 'mood'),
      albums: allCategories.filter(cat => cat.contentType === 'albums'),
      artists: allCategories.filter(cat => cat.contentType === 'artists'),
    };

    res.status(200).json({
      success: true,
      data: {
        homepageSections: homepageCategoriesResult.categories || [],
        featured: featuredResult.categories || [],
        categories: categoriesByType,
        newReleases: newReleasesResult.songs || [],
        trending: trendingResult.songs || [],
        topSongs: topSongsResult.songs || [],
      },
    });
  } catch (error) {
    console.error('Error getting homepage data:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error getting homepage data',
    });
  }
};

/**
 * Get category details with its content
 * @route GET /api/home/category/:id
 */
export const getCategoryWithContent = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error getting category with content:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error getting category',
    });
  }
};

/**
 * Get recommendations based on user preferences
 * @route GET /api/home/recommendations
 */
export const getRecommendations = async (req, res) => {
  try {
    // For now, return featured playlists and top songs
    // Later can be enhanced with user preference algorithm
    const result = await categoryService.getAllCategories({
      type: 'playlist',
      isFeatured: true,
      isActive: true,
      limit: 6,
    });

    res.status(200).json({
      success: true,
      data: result.categories || [],
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error getting recommendations',
    });
  }
};
