const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    if (!err.name) console.error("FULL ERROR:", err);

    if (err.name === 'CastError') {
        const message = `No source found. Invalid ID: ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    if (err.code === 11000) {
        const message = 'This data is already recorded in the system.';
        error = new ErrorResponse(message, 400);
    }

    const statusCode = error.statusCode || err.statusCode || 500;
    const errorMessage = error.message || 'Server Error';

    res.status(statusCode).json({
        success: false,
        error: errorMessage
    });
};

module.exports = errorHandler;