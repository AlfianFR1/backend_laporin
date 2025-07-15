const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const {
  createComment,
  getCommentsByReport,
  updateComment,
  deleteComment,
} = require('../controllers/reportCommentController');
const { ReportComment, Report } = require('../models');

// Mock model
jest.mock('../models');

const app = express();
app.use(bodyParser.json());

// Simulasi middleware auth
app.use((req, res, next) => {
  req.user = { uid: 'mockuid', role: 'user' }; // mock login
  next();
});

// Routes testing langsung ke handler
app.get('/report/:reportId/comments', getCommentsByReport);
app.post('/report/:reportId/comments', createComment);
app.put('/comments/:commentId', updateComment);
app.delete('/comments/:commentId', deleteComment);

describe('🧪 Komentar Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('GET /report/:reportId/comments', () => {
    it('✅ sukses mengambil komentar', async () => {
      ReportComment.findAll.mockResolvedValue([{ id: 1, comment: 'Test' }]);

      const res = await request(app).get('/report/1/comments');

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/Berhasil mengambil komentar/);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('POST /report/:reportId/comments', () => {
    it('✅ sukses membuat komentar', async () => {
      Report.findByPk.mockResolvedValue({ id: 1 }); // report ditemukan
      ReportComment.create.mockResolvedValue({ id: 123, comment: 'Halo' });

      const res = await request(app)
        .post('/report/1/comments')
        .send({ comment: 'Halo', type: 'general' });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toMatch(/berhasil ditambahkan/i);
    });

    it('❌ gagal karena laporan tidak ditemukan', async () => {
      Report.findByPk.mockResolvedValue(null); // report tidak ditemukan

      const res = await request(app)
        .post('/report/999/comments')
        .send({ comment: 'Halo' });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/Laporan tidak ditemukan/i);
    });
  });

  describe('PUT /comments/:commentId', () => {
    it('✅ sukses update komentar sendiri', async () => {
      const mockComment = {
        id: 1,
        user_uid: 'mockuid',
        comment: 'Old',
        type: 'general',
        save: jest.fn(),
      };

      ReportComment.findByPk.mockResolvedValue(mockComment);

      const res = await request(app)
        .put('/comments/1')
        .send({ comment: 'Updated' });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/berhasil diperbarui/i);
      expect(mockComment.save).toHaveBeenCalled();
    });

    it('❌ akses ditolak saat update bukan milik sendiri', async () => {
      const mockComment = {
        id: 1,
        user_uid: 'otheruid',
        comment: 'Old',
        type: 'general',
      };

      ReportComment.findByPk.mockResolvedValue(mockComment);

      const res = await request(app)
        .put('/comments/1')
        .send({ comment: 'Updated' });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/Akses ditolak/);
    });
  });

  describe('DELETE /comments/:commentId', () => {
    it('✅ sukses hapus komentar sendiri', async () => {
      const mockComment = {
        id: 1,
        user_uid: 'mockuid',
        destroy: jest.fn(),
      };

      ReportComment.findByPk.mockResolvedValue(mockComment);

      const res = await request(app).delete('/comments/1');

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/berhasil dihapus/i);
      expect(mockComment.destroy).toHaveBeenCalled();
    });

    it('❌ gagal hapus komentar orang lain', async () => {
      const mockComment = {
        id: 1,
        user_uid: 'otheruid',
      };

      ReportComment.findByPk.mockResolvedValue(mockComment);

      const res = await request(app).delete('/comments/1');

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/akses ditolak/i);
    });
  });
});
