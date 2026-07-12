export class AppError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   */
  constructor(statusCode, message) {
    // Pass the message to the parent Error class
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}