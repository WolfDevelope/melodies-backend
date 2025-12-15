import artistService from '../services/artistService.js';
import User from '../models/User.js';

class ArtistController {
  // GET /api/artists/followed - Lấy danh sách nghệ sĩ user đang theo dõi
  async getFollowedArtists(req, res, next) {
    try {
      const requestedUserId = req.user?._id || req.query.userId || '674f1234567890abcdef1234';

      let user = await User.findById(requestedUserId)
        .populate('followedArtists')
        .select('followedArtists');

      if (!user) {
        user = await User.findOne({})
          .populate('followedArtists')
          .select('followedArtists');
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Người dùng không tồn tại.',
        });
      }

      res.status(200).json({
        success: true,
        data: user?.followedArtists || [],
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/artists - Lấy danh sách nghệ sĩ
  async getAllArtists(req, res, next) {
    try {
      const options = {
        page: req.query.page,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
        search: req.query.search,
        status: req.query.status,
        genre: req.query.genre,
        verified: req.query.verified,
      };

      const result = await artistService.getAllArtists({}, options);

      res.status(200).json({
        success: true,
        data: result.artists,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/artists/:id - Lấy nghệ sĩ theo ID
  async getArtistById(req, res, next) {
    try {
      const artist = await artistService.getArtistById(req.params.id);

      res.status(200).json({
        success: true,
        data: artist,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/artists - Tạo nghệ sĩ mới
  async createArtist(req, res, next) {
    try {
      const artistData = req.body;
      const artist = await artistService.createArtist(artistData);

      res.status(201).json({
        success: true,
        message: 'Đã thêm nghệ sĩ thành công',
        data: artist,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/artists/:id - Cập nhật nghệ sĩ
  async updateArtist(req, res, next) {
    try {
      const updateData = req.body;
      const artist = await artistService.updateArtist(req.params.id, updateData);

      res.status(200).json({
        success: true,
        message: 'Đã cập nhật nghệ sĩ thành công',
        data: artist,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/artists/:id - Xóa nghệ sĩ
  async deleteArtist(req, res, next) {
    try {
      await artistService.deleteArtist(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Đã xóa nghệ sĩ thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/artists/:id/follow - Tăng followers
  async followArtist(req, res, next) {
    try {
      const requestedUserId = req.user?._id || req.body.userId || '674f1234567890abcdef1234';
      const artistId = req.params.id;

      let user = await User.findById(requestedUserId).select('followedArtists');
      if (!user) {
        user = await User.findOne({}).select('followedArtists');
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Người dùng không tồn tại.',
        });
      }

      const alreadyFollowed = (user.followedArtists || []).some(
        (id) => String(id) === String(artistId)
      );

      if (!alreadyFollowed) {
        await User.findByIdAndUpdate(user._id, { $addToSet: { followedArtists: artistId } });
        await artistService.incrementFollowers(artistId);
      }

      const updatedUser = await User.findById(user._id)
        .populate('followedArtists')
        .select('followedArtists');

      res.status(200).json({
        success: true,
        data: updatedUser?.followedArtists || [],
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/artists/:id/unfollow - Giảm followers
  async unfollowArtist(req, res, next) {
    try {
      const requestedUserId = req.user?._id || req.body.userId || '674f1234567890abcdef1234';
      const artistId = req.params.id;

      let user = await User.findById(requestedUserId).select('followedArtists');
      if (!user) {
        user = await User.findOne({}).select('followedArtists');
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Người dùng không tồn tại.',
        });
      }

      const wasFollowed = (user.followedArtists || []).some(
        (id) => String(id) === String(artistId)
      );

      if (wasFollowed) {
        await User.findByIdAndUpdate(user._id, { $pull: { followedArtists: artistId } });
        await artistService.decrementFollowers(artistId);
      }

      const updatedUser = await User.findById(user._id)
        .populate('followedArtists')
        .select('followedArtists');

      res.status(200).json({
        success: true,
        data: updatedUser?.followedArtists || [],
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/artists/statistics - Lấy thống kê
  async getStatistics(req, res, next) {
    try {
      const stats = await artistService.getStatistics();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ArtistController();
