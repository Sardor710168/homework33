const { error } = require("console");

function notFound(req, res, next) {
    res.status(404).json({ succes: false, error: 'Resource not found'})
}

function errorHandler(err, req, res, next) {
    console.error(err);
    const status = err.statusCode || 500
    const message = err.message || 'Internal server Error'
    res.status(status).json({ succes: false, error: message })
}

module.exports = { notFound, errorHandler}