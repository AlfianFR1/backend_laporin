const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Import controller
const { getStatusHistoryByReport } = require('../controllers/reportStatusHistoryController');
const { ReportStatusHistory } = require('../models');

// 🔧 Mock model
jest.mock('../models', () => ({
  ReportStatusHistory: {
    findAll: jest.fn(),
  },
}));

// 🔧 Dummy Express app
const app = express();
app.use(bodyParser.json());
app.get('/reportstatus/:reportId', getStatusHistoryByReport);

describe('GET /reportstatus/:reportId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('✅ berhasil mengambil status history', async () => {
    const dummyHistory = [
      {
        id: 1,
        report_id: '123',
        status: 'resolved',
        changed_by: 'admin123',
        createdAt: new Date(),
      },
    ];

    ReportStatusHistory.findAll.mockResolvedValue(dummyHistory);

    const res = await request(app).get('/reportstatus/123');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Riwayat status berhasil diambil');
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(ReportStatusHistory.findAll).toHaveBeenCalledWith({
      where: { report_id: '123' },
      order: [['createdAt', 'DESC']],
    });
  });

  it('❌ gagal mengambil status history karena error DB', async () => {
    ReportStatusHistory.findAll.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/reportstatus/123');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Gagal mengambil riwayat status');
    expect(res.body).toHaveProperty('error', 'DB error');
  });
});
