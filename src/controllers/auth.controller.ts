import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../middlewares/async';
import { validate } from '../utils/validation/joi';
import * as httpStatus from 'http-status-codes';
import {
  loginSchema,
  refreshTonekSchema,
  registerSchema,
  requiredEmailSchema,
  requiredPasswordSchema,
} from '../utils/validators/authBodysSchema';
import { authService, tokenService, userService, emailService } from '../services';
import { getClientIp } from '../utils/helpers/getClientIp';

/**
 * Register a new user
 * @route POST /api/v1/users/register
 * @access Public
 */
export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  await validate(req.body, registerSchema);
  const { email, password } = req.body as { email: string; password: string };
  const user = await userService.createUser(email, password);
  const ip = 'testip' || getClientIp(req);
  const tokens = await tokenService.generateAuthToken(user, ip);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

/**
 * Authenticate user and get token
 * @route POST /api/v1/users/login
 * @access Public
 * TODO: prevent tining attack
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  await validate(req.body, loginSchema);
  const { email, password } = req.body as { email: string; password: string };
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthToken(user);
  res.status(httpStatus.OK).json({ success: true, user, tokens });
});

/**
 * Logout user and remove token
 * @route POST /api/v1/users/logout
 * @param {Request} req
 * @param {Response} res
 */
export const logout = asyncHandler(async (req, res) => {
  await validate(req.body, refreshTonekSchema);
  await authService.logout(req.body.refreshToken);
  // NO content 204
  res.status(httpStatus.OK).json({ success: true, data: {} });
});

/**
 * Refesh token
 * @route POST /api/v1/users/refresh-token
 * @param {Request} req
 * @param {Response} res
 */
export const refreshTokens = asyncHandler(async (req: Request, res: Response) => {
  await validate(req.body, refreshTonekSchema);
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

/**
 * Reset Password
 * @route POST /api/v1/users/reset-password
 * @param {Request} req
 * @param {Response} res
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await validate(req.body, requiredPasswordSchema);
  const token: any = req.query.token;
  await authService.resetPassword(token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Forgot password
 * @route POST /api/v1/users/forgot-password
 * @param {Request} req
 * @param {Response} res
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await validate(req.body, requiredEmailSchema);
  const email: string = req.body.email;
  const resetPasswordToken = await tokenService.generateResetPasswordToken(email);
  await emailService.sendResetPasswordEmail(email, resetPasswordToken);
  // No content
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Send verification email
 * @route POST /api/v1/users/send-verification-email
 * @param {Request} req
 * @param {Response} res
 */
export const sendVerificationEmail = asyncHandler(async (req: Request, res: Response) => {
  // const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  // await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * @param {Request} req
 * @param {Response} res
 */

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const token: any = req.query.token;
  await authService.verifyEmail(token);
  res.status(httpStatus.NO_CONTENT).send();
});
