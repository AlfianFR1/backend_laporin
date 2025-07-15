const { ReportStatusHistory, Report, User } = require('../models');


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


module.exports = {
  getStatusHistoryByReport,
};
