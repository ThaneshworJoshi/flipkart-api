import BaseError from './BaseError';

/**
 * 404 Data not found error class to handle not found database errors.
 */

class Api404Error extends BaseError {
  /**
   * Constructor of Api404Error.
   *
   * @param {String} message
   * @param {String} details
   */

  constructor(message: string = 'Not Found', details?: string) {
    super(message);
    this.details = details;
    this.statusCode = 404;
    this.isOperational = true;
    Object.setPrototypeOf(this, Api404Error.prototype);
  }
}

export default Api404Error;
