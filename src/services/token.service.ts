import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import { FilterQuery, ObjectId } from 'mongoose';
import { UserDocument } from '../models/user.model';
import jwtConfig, { tokenTypes } from '../config/jwt';
import Token, { TokenDocument } from '../models/token.model';
import TokenError from '../errors/TokenError';
import { userService } from '.';
import Api404Error from '../errors/Api404Error';

/**
 *  Get JWT secret from env variable
 * @param {string} tokenType
 * @returns {string} jwtSecret
 */
const getJWTSecret = (tokenType: string) => {
  switch (tokenType) {
    case tokenTypes.ACCESS:
      return jwtConfig.ACCESS_TOKEN_SECRET;
    case tokenTypes.REFRESH:
      return jwtConfig.REFRESH_TOKEN_SECRET;
    case tokenTypes.RESET_PASSWORD:
      return jwtConfig.REFRESH_TOKEN_SECRET;
    default:
      return '';
  }
};

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} secret
 * @returns {string}
 */
export const generateToken = (userId: ObjectId, expires: Moment, type: string) => {
  const secret: any = getJWTSecret(type);
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };

  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {string} type
 * @param {string} ip
 * @param {Moment} expires
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */

const saveToken = async (
  token: string,
  userId: ObjectId,
  type: string,
  ip: string | undefined,
  expires: Moment,
  blacklisted: boolean = false
) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    type,
    // ip,
    expires: expires.toDate(),
    blacklisted,
  });

  return tokenDoc;
};

/**
 * Get token by query
 * @param {object} query
 * @returns {Promise<Token>}
 */
const findToken = async (query: FilterQuery<TokenDocument>) => {
  return await Token.findOne(query);
};

/**
 *
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
export const verifyToken = async (token: string, type: string | any) => {
  const secret: any = getJWTSecret(type);
  if (secret && type === 'refresh') {
    try {
      const payload = jwt.verify(token, secret);

      const user: any = payload.sub;
      const tokenDoc = await findToken({ token, type, user, blacklisted: false });
      if (tokenDoc) {
        return tokenDoc;
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    // TODO
    return await jwt.verify(token, secret);
  }
  throw new TokenError('Token not found');
};

/**
 * Gernerate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
export const generateAuthToken = async (user: object, ip?: string) => {
  const accessTokenExpires = moment().add(+jwtConfig.ACCESS_TOKEN_EXP_MINUTES, 'minute');
  const accessToken = generateToken(user._id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(+jwtConfig.REFRESH_TOKEN_EXP_DAYS, 'days');
  const refreshToken = generateToken(user._id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user._id, tokenTypes.REFRESH, ip, refreshTokenExpires);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @param {Promise<string>}
 */
export const generateResetPasswordToken = async (email: string) => {
  const user = await userService.findUser({ email });
  if (!user) {
    throw new Api404Error('No user find with this email');
  }

  const expires = moment().add(jwtConfig.RESET_PASSWORD_EXP_MINUTES, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  const ip = '';
  await saveToken(resetPasswordToken, user.id, tokenTypes.RESET_PASSWORD, ip, expires);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {UserDocument} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (user: UserDocument) => {
  const expires = moment().add(jwtConfig.VERIFY_EMAIL_EXPIRATION_MINUTES, 'minutes');
  const ip = '';
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, tokenTypes.VERIFY_EMAIL, ip, expires);
  return verifyEmailToken;
};

export { findToken };
