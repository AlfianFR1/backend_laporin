const { okResponse } = require('../utils/response');

const getAppDetails = async (req, res) => {
    const name = 'laporin api';
    const version = '1.0.0';
    const author = 'Alfian Fathur Rohman';
    const description =
        'This is a REST API application made with Node.js, Express, and Mysql.';

    const packagesVersion = {
        express: '^5.1.0',
        node: '^22.16.0',
        npm: '^10.9.2',
    };

    const appDetails = {
        appName: name,
        appVersion: version,
        appAuthor: author,
        appDescription: description,
        packagesVersion: packagesVersion,
    };

    okResponse(res, appDetails);
};

module.exports = {
    getAppDetails,
};
