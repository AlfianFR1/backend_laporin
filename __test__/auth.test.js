
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

process.env.AUTHFIREBASE_ADMINEMAIL = 'test@example.com'; // WAJIB duluan
require('dotenv').config(); // opsional
const { loginWithGoogle } = require('../controllers/authController');



// Dummy token
const dummyIdToken = 'FAKE_ID_TOKEN';

require('dotenv').config();
// 🔧 Mock Firebase admin + firestore
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

// Buat express app dummy untuk testing controller secara nyata
const app = express();
app.use(bodyParser.json());
app.post('/login', loginWithGoogle);

describe('POST /login', () => {
  it('✅ berhasil login dengan ID token valid', async () => {
    const res = await request(app).post('/login').send({
      idToken: dummyIdToken,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('uid', 'testuid123');
    expect(res.body).toHaveProperty('email', 'test@example.com');
    expect(res.body).toHaveProperty('role', 'admin');
  });

  it('❌ gagal login karena ID token tidak dikirim', async () => {
    const res = await request(app).post('/login').send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'ID Token tidak ditemukan.');
  });
});