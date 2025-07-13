const { getAppDetails } = require('../controllers/homeController');

module.exports = (router) => {
    router.get('/', getAppDetails);
};
