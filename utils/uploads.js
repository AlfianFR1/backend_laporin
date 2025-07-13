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
    fs.unlinkSync(path.join(__dirname, '..', filePath));
};

module.exports = {
    uploads,
    deleteFile,
};
