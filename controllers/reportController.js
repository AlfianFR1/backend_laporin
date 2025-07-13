const { Report, User, ReportComment, ReportStatusHistory } = require('../models');
const { deleteFile } = require('../utils/uploads');
const path = require('path');
const { Op } = require('sequelize');
const fs = require('fs');

// Create a new report
const createReport = async (req, res) => {
  try {
    console.log('[createReport] req.body:', req.body);
    console.log('[createReport] req.file:', req.file);
    console.log('[createReport] req.user:', req.user);

    const { title, description } = req.body;

    if (!title || !description) {
      if (req.file) deleteFile(req.file.path);
      return res.status(400).json({ message: 'Title dan description wajib diisi' });
    }

    if (!req.user || !req.user.uid) {
      if (req.file) deleteFile(req.file.path);
      return res.status(401).json({ message: 'Unauthorized: UID tidak ditemukan' });
    }

    const image_url = req.file ? req.file.path : null;

    const report = await Report.create({
      title,
      description,
      image_url,
      user_uid: req.user.uid,
    });

    res.status(201).json({ message: 'Laporan berhasil dibuat', data: report });
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    res.status(500).json({ message: 'Gagal membuat laporan', error: error.message });
  }
};

// Get all reports (admin only)
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ message: 'Berhasil mengambil semua laporan', data: reports });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil semua laporan', error: error.message });
  }
};

// Get all reports by the current user
const getMyReports = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'Unauthorized: UID tidak ditemukan' });
    }

    const reports = await Report.findAll({
      where: { user_uid: req.user.uid },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ message: 'Laporan milik user berhasil diambil', data: reports });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil laporan', error: error.message });
  }
};

const getMyReportStats = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'Unauthorized: UID tidak ditemukan' });
    }

    const user_uid = req.user.uid;

    const [total, resolved, rejected] = await Promise.all([
      Report.count({ where: { user_uid } }),
      Report.count({ where: { user_uid, status: 'resolved' } }),
      Report.count({
        where: {
          user_uid,
          status: {
            [Op.or]: ['rejected', 'canceled'], // ✅ status rejected atau canceled
          },
        },
      }),
    ]);

    return res.status(200).json({
      message: 'Statistik laporan berhasil diambil',
      data: {
        total,
        resolved,
        rejected,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil statistik laporan', error: error.message });
  }
};

const getAllReportStats = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'Unauthorized: UID tidak ditemukan' });
    }

    const user_uid = req.user.uid;

    const [total, resolved, rejected] = await Promise.all([
      Report.count(),
      Report.count({ where: { status: 'resolved' } }),
      Report.count({
        where: {
          status: {
            [Op.or]: ['rejected', 'canceled'], // ✅ status rejected atau canceled
          },
        },
      }),
    ]);

    return res.status(200).json({
      message: 'Statistik laporan berhasil diambil',
      data: {
        total,
        resolved,
        rejected,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil statistik laporan', error: error.message });
  }
};

// Get a single report by ID
const getReportById = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    if (req.user.role !== 'admin' && req.user.uid !== report.user_uid) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    return res.status(200).json({ message: 'Laporan ditemukan', data: report });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil laporan', error: error.message });
  }
};

// Update report status (admin only)


const updateReportById = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    const changed_by = req.user?.uid || 'unknown';

    if (!report) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    const { title, description, status } = req.body;

    // Validasi status jika ada
    const allowedStatuses = ['pending', 'on_progress', 'resolved', 'canceled', 'rejected'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    // Simpan histori status jika status berubah
    if (status && status !== report.status) {
      await ReportStatusHistory.create({
        report_id: report.id,
        status,
        changed_by,
      });
      report.status = status;
    }

    // Update title dan description jika ada
    if (title !== undefined) report.title = title;
    if (description !== undefined) report.description = description;

    // Ganti gambar jika ada file image diupload
    if (req.file?.filename) {
      try {
        // Hapus gambar lama jika ada
        if (report.image_url) {
          const oldImagePath = path.join(__dirname, '..', report.image_url);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      } catch (err) {
        console.warn('⚠️ Gagal hapus gambar lama:', err.message);
        // Lanjut saja meskipun gagal hapus
      }

      // Simpan path gambar baru
      report.image_url = `storages/${req.file.filename}`;
    }

    await report.save();

    return res.status(200).json({
      message: 'Laporan berhasil diperbarui',
      data: report,
    });
  } catch (error) {
    console.error('❌ updateReportById error:', error);
    return res.status(500).json({
      message: 'Gagal memperbarui laporan',
      error: error.message,
    });
  }
};



const getReportDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findOne({
      where: { id },
      include: [{
        model: ReportComment,
        as: 'comments',
        order: [['createdAt', 'DESC']],
      }],
    });

    if (!report) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    res.status(200).json({
      message: 'Detail laporan ditemukan',
      data: report,
    });
  } catch (error) {
    console.error('[getReportDetail] Gagal mengambil detail:', error);
    res.status(500).json({ message: 'Gagal mengambil detail laporan', error: error.message });
  }
};


module.exports = {
  createReport,
  getAllReports,
  getMyReports,
  getMyReportStats,
  getAllReportStats,
  getReportById,
  updateReportById,
  getReportDetail
};
