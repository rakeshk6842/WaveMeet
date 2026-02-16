// Centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  res.status(status).json({
    error: {
      status,
      message,
      timestamp: new Date().toISOString()
    }
  })
}

// Validation error handler
export const validationErrorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        status: 400,
        message: 'Validation failed',
        details: err.errors,
        timestamp: new Date().toISOString()
      }
    })
  }
  next(err)
}

// Not found handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      status: 404,
      message: 'Route not found',
      path: req.path,
      timestamp: new Date().toISOString()
    }
  })
}

// Async handler wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
