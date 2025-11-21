import artistService from '../services/artistService.js';

class ArtistController {
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
      const artist = await artistService.incrementFollowers(req.params.id);

      res.status(200).json({
        success: true,
        data: artist,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/artists/:id/unfollow - Giảm followers
  async unfollowArtist(req, res, next) {
    try {
      const artist = await artistService.decrementFollowers(req.params.id);

      res.status(200).json({
        success: true,
        data: artist,
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
