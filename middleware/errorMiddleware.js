// 404 Page Not Found handler
function handle404(req, res, next) {
    const err = new Error(`Not Found - ${req.originalUrl}`);
    err.status = 404;
    next(err);
  }
  
  // General error handler
  function handleError(err, req, res, next) {
    const status = err.status || 500;
    let message = err.message;
    
    // If in production, don't show detailed errors
    if (process.env.NODE_ENV === 'production' && status === 500) {
      message = 'Server Error';
    }
    
    // Log error details for server-side debugging
    console.error(`Error: ${status} - ${message}`);
    
    res.status(status).render('errors/error', {
      title: 'Error',
      status,
      message,
      stack: process.env.NODE_ENV === 'production' ? {} : err.stack
    });
  }
  
  module.exports = {
    handle404,
    handleError
  };