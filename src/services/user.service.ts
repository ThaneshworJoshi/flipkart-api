import { DocumentDefinition, FilterQuery, ObjectId } from 'mongoose';
import { userService } from '.';
import Api404Error from '../errors/Api404Error';
import BaseError from '../errors/BaseError';
import ValidationError from '../errors/ValidationError';
import User, { UserDocument } from '../models/user.model';

/**
 * Service to create new user
 * @param {string} email
 * @param {string} password
 * @returns {Promise}
 */
export const createUser = async (email: string, password: string) => {
  if (await findUser({ email })) {
    // Bad request 400
    throw new ValidationError('Email already exists');
  }
  return await User.create({ email, password });
};

/**
 * Service to get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
export const findUserById = async (id: ObjectId) => {
  return User.findById(id);
};

/**
 * Servce to find user
 * @param {FilterQuery<UserDocument>} query
 * @returns {Promise<User>}
 */
export const findUser = async (query: FilterQuery<UserDocument>) => {
  return await User.findOne(query);
};

/**
 * Service to validate password
 * @param {UserDocument['email']} email
 * @param {string} password
 * @returns {boolean|object}
 */
export const validatePassword = async ({ email, password }: { email: UserDocument['email']; password: string }) => {
  const user = await User.findOne({ email });

  if (!user) return false;

  const isValid = await user.matchPassword(password);

  if (!isValid) return false;
  return user.toJSON();
};

/**
 *
 * @param {ObjectId} userid
 * @param {object} updateBody
 * @returns {Promise<Object>}
 */

export const updateUserById = async (userId: ObjectId, updateBody: object) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Api404Error('User not found');
  }
  const { email } = updateBody as { email: string };
  if (email && (await userService.isEmailTaken(email, userId))) {
    //TODO
    throw new ValidationError('Bad Request');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Check if email is taken
 * @param {string} email
 * @param {ObjectId} [excludeUserId]
 * @returns {Promise<boolean>}
 */
export const isEmailTaken = async (email: string, excludeUserId: ObjectId) => {
  const user = await User.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};
