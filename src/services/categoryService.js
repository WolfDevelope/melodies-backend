import Category from '../models/Category.js';

/**
 * Generate slug from name
 */
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Get all categories with filtering, search, and pagination
 */
export const getAllCategories = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      type = '',
      isActive = '',
      isFeatured = '',
      showOnHomepage = '',
      sortBy = 'order',
      sortOrder = 'asc',
    } = filters;

    // Build query
    const query = {};

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by active status
    if (isActive !== '' && isActive !== undefined) {
      query.isActive = isActive === 'true' || isActive === true;
    }

    // Filter by featured status
    if (isFeatured !== '' && isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    // Filter by showOnHomepage status
    if (showOnHomepage !== '' && showOnHomepage !== undefined) {
      query.showOnHomepage = showOnHomepage === 'true' || showOnHomepage === true;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with content populate based on contentType
    const categories = await Category.find(query)
      .populate({
        path: 'songs',
        select: 'title artist album image duration',
        populate: [
          { path: 'artist', select: 'name genre avatar' },
          { path: 'album', select: 'title coverImage' }
        ]
      })
      .populate({
        path: 'albums',
        select: 'title artist genre releaseDate coverImage songs',
        populate: [
          { path: 'artist', select: 'name' },
          { path: 'songs', select: '_id' }
        ]
      })
      .populate({
        path: 'artists',
        select: 'name genre bio avatar image songs',
        populate: { path: 'songs', select: '_id' }
      })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Category.countDocuments(query);

    return {
      categories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId)
      .populate({
        path: 'songs',
        select: 'title artist album image duration',
        populate: [
          { path: 'artist', select: 'name genre avatar' },
          { path: 'album', select: 'title coverImage' }
        ]
      })
      .populate({
        path: 'albums',
        select: 'title artist genre releaseDate coverImage'
      })
      .populate({
        path: 'artists',
        select: 'name genre bio avatar'
      });
    
    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  } catch (error) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = async (slug) => {
  try {
    const category = await Category.findOne({ slug })
      .populate({
        path: 'songs',
        select: 'title artist album image duration',
        populate: [
          { path: 'artist', select: 'name genre avatar' },
          { path: 'album', select: 'title coverImage' }
        ]
      })
      .populate({
        path: 'albums',
        select: 'title artist genre releaseDate coverImage'
      })
      .populate({
        path: 'artists',
        select: 'name genre bio avatar'
      });
    
    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  } catch (error) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
};

/**
 * Create new category
 */
export const createCategory = async (categoryData) => {
  try {
    // Generate slug if not provided
    if (!categoryData.slug) {
      categoryData.slug = generateSlug(categoryData.name);
    }

    const category = new Category(categoryData);
    await category.save();

    return category;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Category with this name or slug already exists');
    }
    throw new Error(`Error creating category: ${error.message}`);
  }
};

/**
 * Update category
 */
export const updateCategory = async (categoryId, updateData) => {
  try {
    // Update slug if name changed
    if (updateData.name && !updateData.slug) {
      updateData.slug = generateSlug(updateData.name);
    }

    const category = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    ).populate('songs', 'title artist');

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Category with this name or slug already exists');
    }
    throw new Error(`Error updating category: ${error.message}`);
  }
};

/**
 * Delete category
 */
export const deleteCategory = async (categoryId) => {
  try {
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    return { message: 'Category deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting category: ${error.message}`);
  }
};

/**
 * Add songs to category
 */
export const addSongsToCategory = async (categoryId, songIds) => {
  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    // Add songs (avoid duplicates)
    const newSongs = songIds.filter(id => !category.songs.includes(id));
    category.songs.push(...newSongs);
    await category.save();

    return await Category.findById(categoryId)
      .populate({
        path: 'songs',
        select: 'title artist album image duration',
        populate: [
          { path: 'artist', select: 'name genre avatar' },
          { path: 'album', select: 'title coverImage' }
        ]
      });
  } catch (error) {
    throw new Error(`Error adding songs to category: ${error.message}`);
  }
};

/**
 * Remove songs from category
 */
export const removeSongsFromCategory = async (categoryId, songIds) => {
  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    // Remove songs
    category.songs = category.songs.filter(id => !songIds.includes(id.toString()));
    await category.save();

    return await Category.findById(categoryId)
      .populate({
        path: 'songs',
        select: 'title artist album image duration',
        populate: [
          { path: 'artist', select: 'name genre avatar' },
          { path: 'album', select: 'title coverImage' }
        ]
      });
  } catch (error) {
    throw new Error(`Error removing songs from category: ${error.message}`);
  }
};

/**
 * Increment view count
 */
export const incrementViewCount = async (categoryId) => {
  try {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  } catch (error) {
    throw new Error(`Error incrementing view count: ${error.message}`);
  }
};

/**
 * Add albums to category
 */
export const addAlbumsToCategory = async (categoryId, albumIds) => {
  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    // Add albums (avoid duplicates)
    const newAlbums = albumIds.filter(id => !category.albums.includes(id));
    category.albums.push(...newAlbums);
    await category.save();

    return await Category.findById(categoryId)
      .populate({
        path: 'albums',
        select: 'title artist genre releaseDate coverImage'
      });
  } catch (error) {
    throw new Error(`Error adding albums to category: ${error.message}`);
  }
};

/**
 * Remove albums from category
 */
export const removeAlbumsFromCategory = async (categoryId, albumIds) => {
  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    // Remove albums
    category.albums = category.albums.filter(id => !albumIds.includes(id.toString()));
    await category.save();

    return await Category.findById(categoryId)
      .populate({
        path: 'albums',
        select: 'title artist genre releaseDate coverImage'
      });
  } catch (error) {
    throw new Error(`Error removing albums from category: ${error.message}`);
  }
};

/**
 * Add artists to category
 */
export const addArtistsToCategory = async (categoryId, artistIds) => {
  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    // Add artists (avoid duplicates)
    const newArtists = artistIds.filter(id => !category.artists.includes(id));
    category.artists.push(...newArtists);
    await category.save();

    return await Category.findById(categoryId)
      .populate({
        path: 'artists',
        select: 'name genre bio avatar'
      });
  } catch (error) {
    throw new Error(`Error adding artists to category: ${error.message}`);
  }
};

/**
 * Remove artists from category
 */
export const removeArtistsFromCategory = async (categoryId, artistIds) => {
  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    // Remove artists
    category.artists = category.artists.filter(id => !artistIds.includes(id.toString()));
    await category.save();

    return await Category.findById(categoryId)
      .populate({
        path: 'artists',
        select: 'name genre bio avatar'
      });
  } catch (error) {
    throw new Error(`Error removing artists from category: ${error.message}`);
  }
};

/**
 * Get category statistics
 */
export const getCategoryStatistics = async () => {
  try {
    const totalCategories = await Category.countDocuments();
    const activeCategories = await Category.countDocuments({ isActive: true });
    const featuredCategories = await Category.countDocuments({ isFeatured: true });
    
    // Count by type
    const typeStats = await Category.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    // Most viewed categories
    const mostViewed = await Category.find()
      .sort({ viewCount: -1 })
      .limit(5)
      .select('name viewCount');

    return {
      total: totalCategories,
      active: activeCategories,
      featured: featuredCategories,
      byType: typeStats,
      mostViewed,
    };
  } catch (error) {
    throw new Error(`Error fetching category statistics: ${error.message}`);
  }
};
