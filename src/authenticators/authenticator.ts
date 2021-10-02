import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../domains/request/AuthenticatedRequest';
import NetworkError from '../errors/Network';
import TokenError from '../errors/TokenError';
import logger from '../utils/logger';

const EMPTY_TOKEN = 'Access token not provided.';

/**
 * Get token from header in request.
 *
 * @param {Request} req
 */
const getTokenFromHeaders = (req: Request) => {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(' ')[0] === 'Bearer' && authorization.split(' ')[1] !== undefined) {
    return authorization.split(' ')[1];
  }

  logger.error(`Token Error: ${EMPTY_TOKEN}`);

  throw new TokenError(EMPTY_TOKEN);
};

/**
 * Validate current user with token received in header.
 *
 * @param {Request} req
 */
export function validateUser(req: Request) {
  const token = getTokenFromHeaders(req);

  return token;
}

/**
 * Validate user or app.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns
 */

export const authenticateRequest = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      headers: { authorization },
    } = req;

    if (!authorization) {
      return next(new TokenError('No Authorization Token', '', 401));
    }

    const requestAuthenticationTag = authorization && authorization.split(' ')[0];

    if (requestAuthenticationTag === 'Bearer') {
      return next();
    }
  } catch (error) {
    if (error instanceof NetworkError) {
      return next(new NetworkError('Something went wrong!'));
    }

    if (error instanceof TokenError) {
      return next(error);
    }
    return next(new TokenError(error.response.data.error.message, '', error.response.data.error.code));
  }
};
