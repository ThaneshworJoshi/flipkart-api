import BaseError from './BaseError';

/**
 * Token error class to handle token errors.
 */
class TokenError extends Error {
  constructor(message: string, public details?: object[], public statusCode?: number, public isOperational?: boolean) {
    super(message);
    this.details = details;
    this.statusCode = 400;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, TokenError.prototype);
  }
}

export default TokenError;
