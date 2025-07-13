const okResponse = (res, data, message, code = 200, status = true) => {
    const format = {
        status,
    };

    if (message) format.message = message;

    if (data) format.data = data;

    return res.status(code).json(format);
};

const notFoundResponse = (res, message, code = 200, status = false) => {
    const format = {
        status,
        message,
        data: null,
    };

    return res.status(code).json(format);
};

const errorResponse = (res, message, code = 400, status = false) => {
    const format = {
        status,
        message,
    };

    return res.status(code).json(format);
};
const serverErrorResponse = (res, message, code = 500, status = false) => {
    const format = {
        status,
        message,
    };

    return res.status(code).json(format);
};

const ERROR_INPUT_VALIDATION = 'Input tidak valid';
const ERROR_PARAMS_VALIDATION = 'Input parameter tidak valid';
const ERROR_NOT_FOUND = 'Data tidak ditemukan';
const ERROR_SERVER = 'Terjadi kesalahan pada server';

const errorMessage = {
    ERROR_INPUT_VALIDATION,
    ERROR_PARAMS_VALIDATION,
    ERROR_NOT_FOUND,
    ERROR_SERVER,
};

module.exports = {
    okResponse,
    notFoundResponse,
    errorResponse,
    serverErrorResponse,
    errorMessage,
};
