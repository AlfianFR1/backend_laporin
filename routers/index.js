const { Router } = require('express');
const homeRoute = require('./homeRoute');
const reportRoute = require('./reportRoute');
const reportstatusRoute = require('./reporStatusRoute');
const authRoute = require('./authRoute');
const reportCommentRoute = require('./reportCommentRoute');
const notificationRoute = require('./notificationRoute')
const router = Router();

module.exports = () => {
    homeRoute(router);
    reportRoute(router);
    reportstatusRoute(router);
    authRoute(router);
    reportCommentRoute(router);
    notificationRoute(router);
    return router;
};
