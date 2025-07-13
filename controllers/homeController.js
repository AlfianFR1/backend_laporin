const { okResponse } = require('../utils/response');

const getAppDetails = async (req, res) => {
    const name = 'Laundry API';
    const version = '1.0.0';
    const author = 'Juan Antonio and Team';
    const description =
        'This is a REST API application made with Node.js, Express, and Mysql.';

    const packagesVersion = {
        express: '^4.18.2',
        node: '^20.9.0',
        npm: '^10.2.1',
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
