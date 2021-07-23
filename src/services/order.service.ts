import { ObjectId } from 'mongoose';
import Order from '../models/order.mode';

/**
 * Create new order
 * @param {object} orderObj
 * @returns {Promise<Order>}
 */
export const createOrder = async (orderObj: object) => {
  return await Order.create(orderObj);
};

/**
 * Get User orders
 * @param {useId} ObjectId
 * @returns {Promise<Order>}
 */
export const getOrders = async (userId: ObjectId) => {
  return await Order.find({ user: userId });
};
