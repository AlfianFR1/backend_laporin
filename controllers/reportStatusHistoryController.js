const { ReportStatusHistory, Report, User } = require('../models');

// Create new status history (usually when status updated)
const createStatusHistory = async (req, res) => {
  try {
    const { report_id, status } = req.body;
    const changed_by = req.user?.uid || 'unknown';

    if (!report_id || !status) {
      return res.status(400).json({ message: 'report_id dan status wajib diisi' });
    }

    // Optional: Pastikan laporan ada
    const report = await Report.findByPk(report_id);
    if (!report) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    const newHistory = await ReportStatusHistory.create({
      report_id,
      status,
      changed_by,
    });

    return res.status(201).json({
      message: 'Riwayat status berhasil dibuat',
      data: newHistory,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal membuat riwayat status',
      error: error.message,
    });
  }
};

// Get all status history for a report
const getStatusHistoryByReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const histories = await ReportStatusHistory.findAll({
      where: { report_id: reportId },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      message: 'Riwayat status berhasil diambil',
      data: histories,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal mengambil riwayat status',
      error: error.message,
    });
  }
};

// Optional: Get all status history (admin only)
const getAllStatusHistories = async (req, res) => {
  try {
    const histories = await ReportStatusHistory.findAll({
      include: [
        {
          model: Report,
          attributes: ['id', 'title'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      message: 'Semua riwayat status berhasil diambil',
      data: histories,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal mengambil semua riwayat status',
      error: error.message,
    });
  }
};

module.exports = {
  createStatusHistory,
  getStatusHistoryByReport,
  getAllStatusHistories,
};
