import { ObjectId } from 'mongoose';
// import Api404Error from '../errors/Api404Error';
import Cart, { CartDocument } from '../models/cart.model';

/**
 * Get category by id
 * @param {ObjectId} cartId
 * @returns {Promise<Cart>}
 */
export const getCartById = async (cartId: ObjectId) => {
  return await Cart.findById({ _id: cartId });
};

/**
 * Get cart by user id
 * @param {ObjectId} userId
 * @param {Promise<Cart>}
 */
export const getCartByUserId = async (userId: ObjectId) => {
  return await Cart.findOne({ user: userId });
};

/**
 * Get Cart Products By userid
 * @param {ObjectId} userId
 * @returns {Promise<Cart>}
 */
export const getCartProductsByUserId = async (userId: ObjectId) => {
  return await Cart.findOne({ user: userId }).populate('cartItems.product', '_id name price productPictures');
};

/**
 * Create new cart
 * @param {OhjectId} userId
 * @param {object} cartItems
 * @returns
 */
export const createNewCart = async (userId: ObjectId, cartItems: object) => {
  return await Cart.create({
    user: userId,
    cartItems: cartItems,
  });
};

/**
 * Update cart item
 * @param {object} condition
 * @param {object} update
 * @returns {Promise<CartDocument}
 */
export const updateCart = (condition: object, update: object) => {
  return new Promise<CartDocument | any>((resolve, reject) => {
    Cart.findOneAndUpdate(condition, update, { upsert: true })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

/**
 * Delete Cart by userId
 * @param {ObjectId}userId
 */
export const deleteCartByUserId = async (userId: ObjectId) => {
  return await Cart.findOneAndDelete({ user: userId });

  // throw new Api404Error('Cart Not Found');
};
