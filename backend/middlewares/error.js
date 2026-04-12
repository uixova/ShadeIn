const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.log("BUG CAUGHT: ".red, err.name);

    //Mongoose
    if (err.name === 'CastError') {
        const message = `No source found. Invalid ID: ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    //Validation
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    //Duplicate Key -11000
    if (err.code === 11000) {
        const message = 'This data is already recorded in the system.';
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;