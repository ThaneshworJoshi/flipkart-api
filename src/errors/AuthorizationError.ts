/**
 * AuthorizationError class to handle unauthorized user making request.
 */

class AuthorizationError extends Error {
  constructor(message: string, public details?: object[], public statusCode?: number, public isOperational?: boolean) {
    super(message);

    this.details = details;
    this.statusCode = 401;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export default AuthorizationError;
