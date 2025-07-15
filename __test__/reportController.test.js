require('dotenv').config(); // Memuat .env

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const os = require('os');
const app = express();

// Mock firebase-admin agar Firestore tidak error saat test
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn()
  },
  firestore: () => ({
    collection: jest.fn(() => ({
      add: jest.fn().mockResolvedValue({ id: 'mock-id' }),
      doc: jest.fn(() => ({
        set: jest.fn().mockResolvedValue(),
        update: jest.fn().mockResolvedValue(),
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => ({
            title: 'Mock Title',
            description: 'Mock Description',
            user_uid: 'mockuid'
          })
        })
      })),
      where: jest.fn(() => ({
        get: jest.fn().mockResolvedValue({
          size: 0,
          forEach: jest.fn()
        })
      })),
      get: jest.fn().mockResolvedValue({
        size: 0,
        forEach: jest.fn()
      })
    }))
  })
}));

// Middleware dasar
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock user middleware
app.use((req, res, next) => {
  req.user = { uid: 'mockuid', role: 'user' }; // ubah role ke 'admin' kalau perlu
  next();
});

// Upload
const upload = multer({ dest: os.tmpdir() });

// Mock model & util
jest.mock('../models', () => ({
  Report: {
    create: jest.fn().mockResolvedValue({ id: 1, title: 'Mock Title', description: 'Mock Description', user_uid: 'mockuid' }),
    findAll: jest.fn().mockResolvedValue([]),
    findByPk: jest.fn().mockResolvedValue({
      id: 1,
      title: 'Old Title',
      description: 'Old Description',
      status: 'pending',
      image_url: null,
      user_uid: 'mockuid',
      save: jest.fn().mockResolvedValue(),
    }),
    count: jest.fn().mockResolvedValue(0),
  },
  ReportStatusHistory: {
    create: jest.fn().mockResolvedValue(),
  },
  ReportComment: {},
  User: {},
}));

jest.mock('../utils/uploads', () => ({
  deleteFile: jest.fn()
}));

const reportController = require('../controllers/reportController');

// Routes
app.post('/reports', upload.single('image'), reportController.createReport);
app.get('/reports', reportController.getAllReports);
app.get('/myreports', reportController.getMyReports);
app.get('/my-report-stats', reportController.getMyReportStats);
app.get('/report-stats', reportController.getAllReportStats);
app.get('/reports/:id', reportController.getReportById);
app.put('/report/:id', upload.single('image'), reportController.updateReportById);

// TESTS
describe('📋 Report Controller Tests', () => {
  it('✅ createReport - berhasil', async () => {
    const res = await request(app)
      .post('/reports')
      .field('title', 'Judul Laporan')
      .field('description', 'Deskripsi laporan')
      .attach('image', Buffer.from('dummy'), 'image.jpg');

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/berhasil/i);
    expect(res.body.data).toHaveProperty('title', 'Mock Title');
  }, 10000);

  it('❌ createReport - gagal tanpa title', async () => {
    const res = await request(app)
      .post('/reports')
      .field('description', 'Deskripsi');

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/wajib/i);
  });

  it('✅ getAllReports', async () => {
    const res = await request(app).get('/reports');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Berhasil/i);
  });

  it('✅ getMyReports', async () => {
    const res = await request(app).get('/myreports');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/user berhasil/i);
  });

  it('✅ getMyReportStats', async () => {
    const res = await request(app).get('/my-report-stats');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('total');
  });

  it('✅ getAllReportStats', async () => {
    const res = await request(app).get('/report-stats');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('total');
  });

  it('✅ getReportById - ditemukan dan boleh diakses', async () => {
    const res = await request(app).get('/reports/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/ditemukan/i);
  });

  it('✅ updateReportById - update berhasil', async () => {
    const res = await request(app)
      .put('/report/1')
      .field('title', 'Update Judul')
      .field('description', 'Update Deskripsi');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/berhasil/i);
  });
});
