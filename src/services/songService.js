import Song from '../models/Song.js';

class SongService {
  // Lấy tất cả bài hát với filter và pagination
  async getAllSongs(filters = {}, options = {}) {
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

      // Search by title, artist, or album
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { artist: { $regex: search, $options: 'i' } },
          { album: { $regex: search, $options: 'i' } },
        ];
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
      const [songs, total] = await Promise.all([
        Song.find(query)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit)),
        Song.countDocuments(query),
      ]);

      return {
        songs,
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

  // Lấy bài hát theo ID
  async getSongById(songId) {
    try {
      const song = await Song.findById(songId);
      if (!song) {
        throw new Error('Không tìm thấy bài hát');
      }
      return song;
    } catch (error) {
      throw error;
    }
  }

  // Tạo bài hát mới
  async createSong(songData) {
    try {
      const song = new Song(songData);
      await song.save();
      return song;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Bài hát đã tồn tại');
      }
      throw error;
    }
  }

  // Cập nhật bài hát
  async updateSong(songId, updateData) {
    try {
      const song = await Song.findByIdAndUpdate(
        songId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!song) {
        throw new Error('Không tìm thấy bài hát');
      }

      return song;
    } catch (error) {
      throw error;
    }
  }

  // Xóa bài hát
  async deleteSong(songId) {
    try {
      const song = await Song.findByIdAndDelete(songId);
      if (!song) {
        throw new Error('Không tìm thấy bài hát');
      }
      return { message: 'Đã xóa bài hát thành công' };
    } catch (error) {
      throw error;
    }
  }

  // Tăng lượt nghe
  async incrementPlays(songId) {
    try {
      const song = await Song.findByIdAndUpdate(
        songId,
        { $inc: { plays: 1 } },
        { new: true }
      );
      if (!song) {
        throw new Error('Không tìm thấy bài hát');
      }
      return song;
    } catch (error) {
      throw error;
    }
  }

  // Tăng/giảm lượt thích
  async toggleLike(songId, increment = true) {
    try {
      const song = await Song.findByIdAndUpdate(
        songId,
        { $inc: { likes: increment ? 1 : -1 } },
        { new: true }
      );
      if (!song) {
        throw new Error('Không tìm thấy bài hát');
      }
      return song;
    } catch (error) {
      throw error;
    }
  }

  // Lấy thống kê
  async getStatistics() {
    try {
      const [
        totalSongs,
        activeSongs,
        inactiveSongs,
        genreStats,
        topSongs,
      ] = await Promise.all([
        Song.countDocuments(),
        Song.countDocuments({ status: 'active' }),
        Song.countDocuments({ status: 'inactive' }),
        Song.aggregate([
          { $group: { _id: '$genre', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Song.find({ status: 'active' })
          .sort({ plays: -1 })
          .limit(10)
          .select('title artist plays likes thumbnail'),
      ]);

      return {
        totalSongs,
        activeSongs,
        inactiveSongs,
        genreStats,
        topSongs,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new SongService();
