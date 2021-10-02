import BaseError from './BaseError';

/**
 * Network Error Class to handle network errors.
 */
class NetworkError extends BaseError {
  constructor(message: string, details?: string) {
    super(message);
    this.details = details;
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export default NetworkError;
