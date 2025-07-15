const notificationController = require('../controllers/notificationController');

module.exports = (router) => {
  router.post('/notify/token', notificationController.sendToToken);
  router.post('/notify/topic', notificationController.sendToTopic);
};
