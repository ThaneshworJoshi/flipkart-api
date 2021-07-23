import * as HttpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { buildError } from '../utils/error';
import logger from '../utils/logger';

/**
 * Error response middleware for 404 not found
 *
 * @param {Request} req
 * @param {Respones} res
 */
export function notFound(req: Request, res: Response) {
  res.status(HttpStatus.NOT_FOUND).json({
    error: {
      code: HttpStatus.NOT_FOUND,
      message: HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
    },
  });
}

/**
 * Generaic error response middleware for validation and internal server errors.
 *
 * @param {Object} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

export function genericErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (!err.status) {
    console.log(err.message);
    logger.error(err.stack);
  }

  const error = buildError(err);

  res.status(error.code).json({ error });
}
