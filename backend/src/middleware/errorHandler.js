// This is our centralized error handling middleware.
// Any time we pass an error to next(err) in our controllers, Express routes it here.
const errorHandler = (err, req, res, next) => {
  // If the error doesn't have a status code, default to 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;
  
  // Log the error for our own backend debugging
  console.error(`[Error Handler] ${statusCode} - ${err.message}`);

  // Send a clean, structured JSON response back to the frontend
  res.status(statusCode).json({
    success: false,
    message: err.message
  });
};

export default errorHandler;
