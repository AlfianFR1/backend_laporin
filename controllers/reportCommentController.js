const { ReportComment, Report, User } = require('../models');

// Create comment
const createComment = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { comment, type } = req.body;

    const report = await Report.findByPk(reportId);
    if (!report) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

    const newComment = await ReportComment.create({
      report_id: reportId,
      user_uid: req.user.uid,
      actor: req.user.role, // 'admin' atau 'user'
      type: type || 'general',
      comment,
    });

    res.status(201).json({ message: 'Komentar berhasil ditambahkan', data: newComment });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambahkan komentar', error: err.message });
  }
};

// Read all comments for a report
const getCommentsByReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const comments = await ReportComment.findAll({
      where: { report_id: reportId },
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json({ message: 'Berhasil mengambil komentar', data: comments });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil komentar', error: err.message });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment, type } = req.body;

    const existing = await ReportComment.findByPk(commentId);
    if (!existing) return res.status(404).json({ message: 'Komentar tidak ditemukan' });

    if (req.user.role !== 'admin' && req.user.uid !== existing.user_uid) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    existing.comment = comment ?? existing.comment;
    existing.type = type ?? existing.type;
    await existing.save();

    res.status(200).json({ message: 'Komentar berhasil diperbarui', data: existing });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui komentar', error: err.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const existing = await ReportComment.findByPk(commentId);
    if (!existing) return res.status(404).json({ message: 'Komentar tidak ditemukan' });

    if (req.user.role !== 'admin' && req.user.uid !== existing.user_uid) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    await existing.destroy();
    res.status(200).json({ message: 'Komentar berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus komentar', error: err.message });
  }
};

module.exports = {
  createComment,
  getCommentsByReport,
  updateComment,
  deleteComment,
};
