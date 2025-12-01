import albumService from '../services/albumService.js';

class AlbumController {
  // GET /api/albums - Lấy danh sách albums
  async getAllAlbums(req, res, next) {
    try {
      const options = {
        page: req.query.page,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
        search: req.query.search,
        status: req.query.status,
        genre: req.query.genre,
      };

      const result = await albumService.getAllAlbums({}, options);

      res.status(200).json({
        success: true,
        data: result.albums,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/albums/:id - Lấy album theo ID
  async getAlbumById(req, res, next) {
    try {
      const album = await albumService.getAlbumById(req.params.id);

      res.status(200).json({
        success: true,
        data: album,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/albums - Tạo album mới
  async createAlbum(req, res, next) {
    try {
      const albumData = req.body;
      const album = await albumService.createAlbum(albumData);

      res.status(201).json({
        success: true,
        message: 'Đã thêm album thành công',
        data: album,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/albums/:id - Cập nhật album
  async updateAlbum(req, res, next) {
    try {
      const updateData = req.body;
      const album = await albumService.updateAlbum(req.params.id, updateData);

      res.status(200).json({
        success: true,
        message: 'Đã cập nhật album thành công',
        data: album,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/albums/:id - Xóa album
  async deleteAlbum(req, res, next) {
    try {
      await albumService.deleteAlbum(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Đã xóa album thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/albums/:id/play - Tăng lượt phát
  async incrementPlays(req, res, next) {
    try {
      const album = await albumService.incrementPlays(req.params.id);

      res.status(200).json({
        success: true,
        data: album,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/albums/:id/like - Toggle like
  async toggleLike(req, res, next) {
    try {
      const album = await albumService.toggleLike(req.params.id);

      res.status(200).json({
        success: true,
        data: album,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/albums/statistics - Lấy thống kê
  async getStatistics(req, res, next) {
    try {
      const stats = await albumService.getStatistics();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AlbumController();
