/**
 * ValidationError error class to handle validation errors.
 */

class ValidationError extends Error {
  constructor(message: string, public details?: object[], public statusCode?: number, public isOperational?: boolean) {
    super(message);
    this.statusCode = 400;
    this.details = details;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export default ValidationError;
