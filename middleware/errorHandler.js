function notFound(req, res, next) {
  res.status(404).json({ success: false, error: 'Resource not found' });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, error: message });
}

module.exports = { notFound, errorHandler };
