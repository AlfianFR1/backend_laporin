const multer = require('multer');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './storages');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = moment().format('YYYYMMDDHHmmss');
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const uploads = multer({ storage });

const deleteFile = (filePath) => {
    try {
  const oldImagePath = path.join(__dirname, '..', report.image_url);
  if (fs.existsSync(oldImagePath)) {
    fs.unlinkSync(oldImagePath);
  }
} catch (err) {
  console.warn('⚠️ Gagal hapus gambar lama:', err.message);
}

};

module.exports = {
    uploads,
    deleteFile,
};
