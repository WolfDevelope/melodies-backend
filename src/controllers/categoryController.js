import * as categoryService from '../services/categoryService.js';

/**
 * Get all categories
 * GET /api/categories
 */
export const getAllCategories = async (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      type: req.query.type,
      isActive: req.query.isActive,
      isFeatured: req.query.isFeatured,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };

    const result = await categoryService.getAllCategories(filters);

    res.status(200).json({
      success: true,
      data: result.categories,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get category by ID
 * GET /api/categories/:id
 */
export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get category by slug
 * GET /api/categories/slug/:slug
 */
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Create new category
 * POST /api/categories
 */
export const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update category
 * PUT /api/categories/:id
 */
export const updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete category
 * DELETE /api/categories/:id
 */
export const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Add songs to category
 * POST /api/categories/:id/songs
 */
export const addSongsToCategory = async (req, res) => {
  try {
    const { songIds } = req.body;

    if (!songIds || !Array.isArray(songIds)) {
      return res.status(400).json({
        success: false,
        message: 'songIds must be an array',
      });
    }

    const category = await categoryService.addSongsToCategory(req.params.id, songIds);

    res.status(200).json({
      success: true,
      message: 'Songs added to category successfully',
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Remove songs from category
 * DELETE /api/categories/:id/songs
 */
export const removeSongsFromCategory = async (req, res) => {
  try {
    const { songIds } = req.body;

    if (!songIds || !Array.isArray(songIds)) {
      return res.status(400).json({
        success: false,
        message: 'songIds must be an array',
      });
    }

    const category = await categoryService.removeSongsFromCategory(req.params.id, songIds);

    res.status(200).json({
      success: true,
      message: 'Songs removed from category successfully',
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Add albums to category
 * POST /api/categories/:id/albums
 */
export const addAlbumsToCategory = async (req, res) => {
  try {
    const { albumIds } = req.body;

    if (!albumIds || !Array.isArray(albumIds)) {
      return res.status(400).json({
        success: false,
        message: 'albumIds must be an array',
      });
    }

    const category = await categoryService.addAlbumsToCategory(req.params.id, albumIds);

    res.status(200).json({
      success: true,
      message: 'Albums added to category successfully',
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Remove albums from category
 * DELETE /api/categories/:id/albums
 */
export const removeAlbumsFromCategory = async (req, res) => {
  try {
    const { albumIds } = req.body;

    if (!albumIds || !Array.isArray(albumIds)) {
      return res.status(400).json({
        success: false,
        message: 'albumIds must be an array',
      });
    }

    const category = await categoryService.removeAlbumsFromCategory(req.params.id, albumIds);

    res.status(200).json({
      success: true,
      message: 'Albums removed from category successfully',
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Add artists to category
 * POST /api/categories/:id/artists
 */
export const addArtistsToCategory = async (req, res) => {
  try {
    const { artistIds } = req.body;

    if (!artistIds || !Array.isArray(artistIds)) {
      return res.status(400).json({
        success: false,
        message: 'artistIds must be an array',
      });
    }

    const category = await categoryService.addArtistsToCategory(req.params.id, artistIds);

    res.status(200).json({
      success: true,
      message: 'Artists added to category successfully',
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Remove artists from category
 * DELETE /api/categories/:id/artists
 */
export const removeArtistsFromCategory = async (req, res) => {
  try {
    const { artistIds } = req.body;

    if (!artistIds || !Array.isArray(artistIds)) {
      return res.status(400).json({
        success: false,
        message: 'artistIds must be an array',
      });
    }

    const category = await categoryService.removeArtistsFromCategory(req.params.id, artistIds);

    res.status(200).json({
      success: true,
      message: 'Artists removed from category successfully',
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Increment view count
 * PUT /api/categories/:id/view
 */
export const incrementViewCount = async (req, res) => {
  try {
    const category = await categoryService.incrementViewCount(req.params.id);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get category statistics
 * GET /api/categories/statistics
 */
export const getCategoryStatistics = async (req, res) => {
  try {
    const stats = await categoryService.getCategoryStatistics();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
