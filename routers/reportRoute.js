const {
  createReport,
  getAllReports,
  getMyReports,
  getMyReportStats,
  getReportById,
  updateReportById,
  cancelReportById,
  getReportDetail,
  getAllReportStats
} = require('../controllers/reportController');

const express = require('express');

// const checkToken = require('../middlewares/checkToken');
// const checkRole = require('../middlewares/checkRole');
const { uploads } = require('../utils/uploads');
const firebaseAuth = require('../middlewares/firebaseAuth');



module.exports = (router) => {
router.post('/reports', firebaseAuth, uploads.single('image'), createReport);
    router.get('/myreports', firebaseAuth,getMyReports)
    router.get('/report/:id', firebaseAuth, getReportDetail);
    router.get('/my-report-stats', firebaseAuth, getMyReportStats);
    router.get('/report-stats', firebaseAuth, getAllReportStats);
    router.get('/reports',  firebaseAuth, getAllReports);


    
    router.get('/reports/:id',  getReportById);

    router.put(
        '/report/:id',
        firebaseAuth,
        uploads.single('image'),
        updateReportById
    );
    router.delete('/reports/:id',cancelReportById);
};
