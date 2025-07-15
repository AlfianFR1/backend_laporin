const errorHandler = (err, req, res, next) => {
    console.log('Error: ', err.message);
    console.log('Stack: ', err.stack);
    res.status(err.statusCode || 500).json({
        status: false,
        message: err.message || 'Internal Server Error',
    });
};

module.exports = {
    errorHandler,
};
