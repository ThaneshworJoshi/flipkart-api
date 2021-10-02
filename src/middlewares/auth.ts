import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthorizationError from '../errors/AuthorizationError';
import TokenError from '../errors/TokenError';
import User from '../models/user.model';
import { verifyToken } from '../services/token.service';
import logger from '../utils/logger';
import { asyncHandler } from './async';

export const requireSignin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      let token = req.headers.authorization.split(' ')[1];

      const decode = await verifyToken(token, 'access');
      //@ts-ignore
      req.user = await User.findById(decode.sub).select('-password');
      next();
    } catch (error) {
      logger.error(error);
      throw new TokenError('Not authorized, token failed', '', 401);
    }
  } else {
    return next(new TokenError('Not authorized, no token'));
  }
});

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  if (req.user && req.user.role === 2) {
    next();
  } else {
    throw new AuthorizationError('Not Authorized');
  }
};

//TODO
export const isUser = (req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  if (req.user && req.user.role === 0) {
    next();
  } else {
    throw new AuthorizationError('Not Authorized');
  }
};
