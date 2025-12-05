import Album from '../models/Album.js';
import Artist from '../models/Artist.js';

class AlbumService {
  // Lấy tất cả albums với filter và pagination
  async getAllAlbums(filters = {}, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search = '',
        status = '',
        genre = '',
      } = options;

      // Build query
      const query = {};

      // Search by title or artist name
      if (search) {
        try {
          // Search for artists matching the search term
          const artists = await Artist.find({
            name: { $regex: search, $options: 'i' }
          }).select('_id');
          const artistIds = artists.map(a => a._id);

          // Build OR query for title or artist IDs
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
          ];
          
          if (artistIds.length > 0) {
            query.$or.push({ artist: { $in: artistIds } });
          }
        } catch (error) {
          // If Artist model doesn't exist, just search by title
          console.log('Search by artist not available:', error.message);
          query.title = { $regex: search, $options: 'i' };
        }
      }

      // Filter by status
      if (status) {
        query.status = status;
      }

      // Filter by genre
      if (genre) {
        query.genre = genre;
      }

      // Calculate skip
      const skip = (page - 1) * limit;

      // Sort order
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query
      const [albums, total] = await Promise.all([
        Album.find(query)
          .populate('artist', 'name genre avatar')
          .populate('songs', '_id title')
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit)),
        Album.countDocuments(query),
      ]);

      return {
        albums,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Lấy album theo ID
  async getAlbumById(albumId) {
    try {
      const album = await Album.findById(albumId)
        .populate('artist', 'name genre avatar')
        .populate('songs', '_id title artist duration');
      if (!album) {
        throw new Error('Không tìm thấy album');
      }
      return album;
    } catch (error) {
      throw error;
    }
  }

  // Tạo album mới
  async createAlbum(albumData) {
    try {
      const album = new Album(albumData);
      await album.save();
      return album;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Album đã tồn tại');
      }
      throw error;
    }
  }

  // Cập nhật album
  async updateAlbum(albumId, updateData) {
    try {
      const album = await Album.findByIdAndUpdate(
        albumId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!album) {
        throw new Error('Không tìm thấy album');
      }

      return album;
    } catch (error) {
      throw error;
    }
  }

  // Xóa album
  async deleteAlbum(albumId) {
    try {
      const album = await Album.findByIdAndDelete(albumId);
      if (!album) {
        throw new Error('Không tìm thấy album');
      }
      return { message: 'Đã xóa album thành công' };
    } catch (error) {
      throw error;
    }
  }

  // Tăng lượt phát
  async incrementPlays(albumId) {
    try {
      const album = await Album.findByIdAndUpdate(
        albumId,
        { $inc: { plays: 1 } },
        { new: true }
      );
      if (!album) {
        throw new Error('Không tìm thấy album');
      }
      return album;
    } catch (error) {
      throw error;
    }
  }

  // Toggle like
  async toggleLike(albumId) {
    try {
      const album = await Album.findById(albumId);
      if (!album) {
        throw new Error('Không tìm thấy album');
      }

      // Simple toggle - increment or decrement
      album.likes = album.likes > 0 ? album.likes - 1 : album.likes + 1;
      await album.save();

      return album;
    } catch (error) {
      throw error;
    }
  }

  // Lấy thống kê
  async getStatistics() {
    try {
      const [
        totalAlbums,
        activeAlbums,
        inactiveAlbums,
        genreStats,
        topAlbums,
        totalTracks,
      ] = await Promise.all([
        Album.countDocuments(),
        Album.countDocuments({ status: 'active' }),
        Album.countDocuments({ status: 'inactive' }),
        Album.aggregate([
          { $group: { _id: '$genre', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Album.find({ status: 'active' })
          .sort({ plays: -1 })
          .limit(10)
          .select('title artist plays likes coverImage'),
        Album.aggregate([
          { $group: { _id: null, total: { $sum: '$totalTracks' } } },
        ]),
      ]);

      return {
        totalAlbums,
        activeAlbums,
        inactiveAlbums,
        totalTracks: totalTracks[0]?.total || 0,
        genreStats,
        topAlbums,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new AlbumService();
