import { FilterQuery, ObjectId } from 'mongoose';
import { tokenService, userService } from '.';
import { tokenTypes } from '../config/jwt';
import Api404Error from '../errors/Api404Error';
import AuthorizationError from '../errors/AuthorizationError';
import Token, { TokenDocument } from '../models/token.model';
import { findToken } from './token.service';
import { findUser } from './user.service';

/**
 * Login with username(email) and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string) => {
  const user = await findUser({ email, isBanned: false });
  if (!user || !(await user.matchPassword(password))) {
    throw new AuthorizationError('Incorrect email or password');
  }
  return { _id: user._id, role: user.role, email: user.email };
};

/**
 * Logout user
 * @param {string} refreshToken
 * @returns {Promise}
 */
export const logout = async (refreshToken: string) => {
  const type: any = tokenTypes.REFRESH;
  const refreshTokenDoc = await findToken({ token: refreshToken, type, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new Api404Error();
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth token
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    //@ts-ignore
    const user = await userService.findUserById(refreshTokenDoc.user);
    if (!user) {
      throw new AuthorizationError('Please authenticate');
    }
    //@ts-ignore
    await refreshTokenDoc.remove();
    return tokenService.generateAuthToken(user);
  } catch (error) {
    throw new AuthorizationError('Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
export const resetPassword = async (resetPasswordToken: string, newPassword: string) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    //@ts-ignore
    const user = await userService.findUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new AuthorizationError('Password reset failed');
    }
    const type: string = tokenTypes.RESET_PASSWORD;
    const userId: ObjectId = user.id;
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: userId, type } as FilterQuery<TokenDocument>);
  } catch (error) {
    throw new AuthorizationError('Password reset failed');
  }
};

/**
 * Verify email
 * @param verifyEmailToken
 * @returns {Promise}
 */
export const verifyEmail = async (verifyEmailToken: string) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    //@ts-ignore
    const user = await userService.findUser(verifyEmailTokenDoc.user);
    if (!user) {
      throw new AuthorizationError('Email verification failed');
    }
    await userService.updateUserById(user.id, { isEmailVerified: true });
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL } as FilterQuery<TokenDocument>);
  } catch (error) {
    throw new AuthorizationError('Email verification failed');
  }
};
