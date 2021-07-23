/**
 * Generic base error class that will be extended by other errors.
 */
class BaseError extends Error {
  public status: string;

  constructor(message: string, public details?: string, public statusCode?: number, public isOperational?: boolean) {
    super(message);

    this.details = details;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

export default BaseError;
