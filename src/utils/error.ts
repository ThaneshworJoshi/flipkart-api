import * as HttpStatus from 'http-status-codes';
import AuthorizationError from '../errors/AuthorizationError';
import BaseError from '../errors/BaseError';
import TokenError from '../errors/TokenError';
import ValidationError from '../errors/ValidationError';
/**
 * Build error response for validation errors
 *
 * @param {Error} err
 * @return {array|object}
 */

export function buildError(err: any) {
  if (err.name === 'CastError') {
    return {
      code: 404,
      message: 'Resource not found',
    };
  }

  // Syntax errors
  if (err instanceof SyntaxError) {
    return {
      code: 400,
      message: HttpStatus.getStatusText(HttpStatus.StatusCodes.BAD_REQUEST),
    };
  }

  // Validation errors
  if (err instanceof ValidationError) {
    return {
      code: HttpStatus.StatusCodes.BAD_REQUEST,
      message: err.message,
      details:
        err.details &&
        err.details.map((error: any) => {
          return {
            message: error.message,
            param: error.path,
          };
        }),
    };
  }

  // Authorization error
  if (err instanceof AuthorizationError) {
    return {
      code: HttpStatus.StatusCodes.UNAUTHORIZED,
      message: err.message,
    };
  }

  // Joi errors
  if (err.isJoi) {
    return {
      code: HttpStatus.StatusCodes.BAD_REQUEST,
      message: HttpStatus.getStatusText(HttpStatus.StatusCodes.BAD_REQUEST),
      details:
        err.details &&
        err.details.map((error: any) => {
          return { message: error.message, param: error.path };
        }),
    };
  }

  if (err instanceof BaseError) {
    const httpCode = err.statusCode ? err.statusCode : HttpStatus.StatusCodes.BAD_REQUEST;

    return {
      code: httpCode,
      message: err.message,
      data: err.details,
    };
  }

  if (err instanceof TokenError) {
    return {
      code: HttpStatus.StatusCodes.FORBIDDEN,
      message: 'FORBIDDEN',
    };
  }

  return {
    code: HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
    message: HttpStatus.getStatusText(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
  };
}
