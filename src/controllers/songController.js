import songService from '../services/songService.js';

class SongController {
  // GET /api/songs - Lấy danh sách bài hát
  async getAllSongs(req, res, next) {
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

      const result = await songService.getAllSongs({}, options);

      res.status(200).json({
        success: true,
        data: result.songs,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/songs/:id - Lấy bài hát theo ID
  async getSongById(req, res, next) {
    try {
      const song = await songService.getSongById(req.params.id);

      res.status(200).json({
        success: true,
        data: song,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/songs - Tạo bài hát mới
  async createSong(req, res, next) {
    try {
      const songData = req.body;
      const song = await songService.createSong(songData);

      res.status(201).json({
        success: true,
        message: 'Đã thêm bài hát thành công',
        data: song,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/songs/:id - Cập nhật bài hát
  async updateSong(req, res, next) {
    try {
      const updateData = req.body;
      const song = await songService.updateSong(req.params.id, updateData);

      res.status(200).json({
        success: true,
        message: 'Đã cập nhật bài hát thành công',
        data: song,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/songs/:id - Xóa bài hát
  async deleteSong(req, res, next) {
    try {
      await songService.deleteSong(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Đã xóa bài hát thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/songs/:id/play - Tăng lượt nghe
  async incrementPlays(req, res, next) {
    try {
      const song = await songService.incrementPlays(req.params.id);

      res.status(200).json({
        success: true,
        data: song,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/songs/:id/like - Toggle like
  async toggleLike(req, res, next) {
    try {
      const { increment = true } = req.body;
      const song = await songService.toggleLike(req.params.id, increment);

      res.status(200).json({
        success: true,
        data: song,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/songs/statistics - Lấy thống kê
  async getStatistics(req, res, next) {
    try {
      const stats = await songService.getStatistics();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SongController();
