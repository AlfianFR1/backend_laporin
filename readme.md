# 📢 Lapor.in - Backend

[![CI](https://github.com/AlfianFR1/backend_laporin/actions/workflows/ci.yml/badge.svg)](https://github.com/AlfianFR1/backend_laporin/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/AlfianFR1/backend_laporin/branch/main/graph/badge.svg)](https://codecov.io/gh/AlfianFR1/backend_laporin)
![License](https://img.shields.io/github/license/AlfianFR1/backend_laporin)
![Last Commit](https://img.shields.io/github/last-commit/AlfianFR1/backend_laporin)
![Node.js](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen)


Sistem backend untuk aplikasi **Lapor.in**, sebuah platform pelaporan masalah oleh pengguna dengan autentikasi Firebase dan pengelolaan status laporan berbasis role admin/user.

---

## ✨ Fitur Utama

- 🔐 Autentikasi Google Firebase
- 🧾 CRUD Laporan dengan gambar (multer)
- 🧑‍💼 Role admin/user dengan otorisasi
- 📝 Komentar & histori status laporan
- 📊 Statistik laporan
- ✅ Unit test (Jest + Supertest)
- ☁️ CI/CD dengan GitHub Actions + Coveralls

---

## 🚀 Teknologi yang Digunakan

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)
- [MySQL](https://www.mysql.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Jest](https://jestjs.io/) + [Supertest](https://github.com/ladjs/supertest)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Coveralls](https://coveralls.io/) (opsional)

---

## 📦 Instalasi & Setup

```bash
# Clone repository
git clone https://github.com/AlfianFR1/backend_laporin.git
cd backend_laporin

# Install dependencies
npm install

# Salin file konfigurasi
cp .env.example .env

# Jalankan migrasi database
npx sequelize-cli db:migrate

# Jalankan server lokal
npm run dev
