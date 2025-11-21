import Artist from '../models/Artist.js';

class ArtistService {
  // Lấy tất cả nghệ sĩ với filter và pagination
  async getAllArtists(filters = {}, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search = '',
        status = '',
        genre = '',
        verified = '',
      } = options;

      // Build query
      const query = {};

      // Search by name
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
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

      // Filter by verified
      if (verified !== '') {
        query.verified = verified === 'true';
      }

      // Calculate skip
      const skip = (page - 1) * limit;

      // Sort order
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query
      const [artists, total] = await Promise.all([
        Artist.find(query)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit)),
        Artist.countDocuments(query),
      ]);

      return {
        artists,
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

  // Lấy nghệ sĩ theo ID
  async getArtistById(artistId) {
    try {
      const artist = await Artist.findById(artistId);
      if (!artist) {
        throw new Error('Không tìm thấy nghệ sĩ');
      }
      return artist;
    } catch (error) {
      throw error;
    }
  }

  // Tạo nghệ sĩ mới
  async createArtist(artistData) {
    try {
      const artist = new Artist(artistData);
      await artist.save();
      return artist;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Nghệ sĩ đã tồn tại');
      }
      throw error;
    }
  }

  // Cập nhật nghệ sĩ
  async updateArtist(artistId, updateData) {
    try {
      const artist = await Artist.findByIdAndUpdate(
        artistId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!artist) {
        throw new Error('Không tìm thấy nghệ sĩ');
      }

      return artist;
    } catch (error) {
      throw error;
    }
  }

  // Xóa nghệ sĩ
  async deleteArtist(artistId) {
    try {
      const artist = await Artist.findByIdAndDelete(artistId);
      if (!artist) {
        throw new Error('Không tìm thấy nghệ sĩ');
      }
      return { message: 'Đã xóa nghệ sĩ thành công' };
    } catch (error) {
      throw error;
    }
  }

  // Tăng followers
  async incrementFollowers(artistId) {
    try {
      const artist = await Artist.findByIdAndUpdate(
        artistId,
        { $inc: { followers: 1 } },
        { new: true }
      );
      if (!artist) {
        throw new Error('Không tìm thấy nghệ sĩ');
      }
      return artist;
    } catch (error) {
      throw error;
    }
  }

  // Giảm followers
  async decrementFollowers(artistId) {
    try {
      const artist = await Artist.findByIdAndUpdate(
        artistId,
        { $inc: { followers: -1 } },
        { new: true }
      );
      if (!artist) {
        throw new Error('Không tìm thấy nghệ sĩ');
      }
      return artist;
    } catch (error) {
      throw error;
    }
  }

  // Lấy thống kê
  async getStatistics() {
    try {
      const [
        totalArtists,
        activeArtists,
        inactiveArtists,
        verifiedArtists,
        genreStats,
        topArtists,
      ] = await Promise.all([
        Artist.countDocuments(),
        Artist.countDocuments({ status: 'active' }),
        Artist.countDocuments({ status: 'inactive' }),
        Artist.countDocuments({ verified: true }),
        Artist.aggregate([
          { $group: { _id: '$genre', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Artist.find({ status: 'active' })
          .sort({ followers: -1 })
          .limit(10)
          .select('name followers totalSongs avatar verified'),
      ]);

      return {
        totalArtists,
        activeArtists,
        inactiveArtists,
        verifiedArtists,
        genreStats,
        topArtists,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new ArtistService();
