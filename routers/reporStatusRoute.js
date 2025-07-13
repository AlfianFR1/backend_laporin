const express = require('express');

const controller = require('../controllers/reportStatusHistoryController');
const firebaseAuth = require('../middlewares/firebaseAuth');

const {
    getStatusHistoryByReport
} = require('../controllers/reportStatusHistoryController');


module.exports = (router)=>{
    // router.post('/', authenticate, controller.createStatusHistory);
router.get('/reportstatus/:reportId', getStatusHistoryByReport);
// router.get('/', authenticate, controller.getAllStatusHistories);



}
