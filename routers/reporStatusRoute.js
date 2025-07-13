const express = require('express');

const controller = require('../controllers/reportStatusHistoryController');
const firebaseAuth = require('../middlewares/firebaseAuth');

const {
    getStatusHistoryByReport
} = require('../controllers/reportStatusHistoryController');


module.exports = (router)=>{

router.get('/reportstatus/:reportId', firebaseAuth, getStatusHistoryByReport);




}
