// __tests__/auth.test.js

require('dotenv').config();
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Import controller (modul yang mau kita test)
const { loginWithGoogle } = require('../controllers/authController');

// Buat express app sementara untuk test endpoint

const ADMIN_EMAIL = process.env.AUTHFIREBASE_ADMINEMAIL;


const app = express();
app.use(bodyParser.json());
app.post('/login', loginWithGoogle);

// 🔧 Mock Firebase admin
jest.mock('../config/firebase', () => {
  const mockSet = jest.fn().mockResolvedValue();
  const mockGet = jest.fn().mockResolvedValue({
    exists: false,
    data: () => null,
  });

  const mockDoc = jest.fn(() => ({
    set: mockSet,
    get: mockGet,
  }));

  const mockCollection = jest.fn(() => ({
    doc: mockDoc,
  }));

  return {
    admin: {
      auth: () => ({
        verifyIdToken: jest.fn().mockResolvedValue({
          uid: 'testuid123',
          email: 'test@example.com',
          name: 'Test User',
          picture: 'https://avatar.example.com/test',
        }),
      }),
      firestore: {
        FieldValue: {
          serverTimestamp: jest.fn(() => 'MOCK_TIMESTAMP'),
        },
      },
    },
    db: {
      collection: mockCollection,
    },
  };
});



describe('POST /login', () => {
  it('✅ berhasil login dengan ID token valid', async () => {
    const res = await request(app).post('/login').send({
      idToken: 'dummy-valid-id-token',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('uid');
    expect(res.body.email).toBe('test@example.com');
    expect(res.body.role).toBeDefined();
  });

  it('❌ gagal login karena ID token tidak dikirim', async () => {
    const res = await request(app).post('/login').send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('ID Token tidak ditemukan.');
  });
});
