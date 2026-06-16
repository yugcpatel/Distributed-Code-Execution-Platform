export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${req.method}] ${req.originalUrl} - ${timestamp}`);
  next();
};

export default requestLogger;
