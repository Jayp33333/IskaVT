/**
 * Wraps an async route handler so thrown errors propagate to Express'
 * error middleware instead of becoming unhandled promise rejections.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
