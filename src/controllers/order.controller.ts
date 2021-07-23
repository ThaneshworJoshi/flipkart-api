import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/async';
import { OrderDocument } from '../models/order.mode';
import { cartService, orderService } from '../services';
import * as httpStatus from 'http-status-codes';
import { validate } from '../utils/validation/joi';
import { orderSchema } from '../utils/validators/orderBodySchema';

/**
 * Get orders
 * @route GET /api/v1/orders
 * @access Public/User
 */
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  //@ts-ignore
  const orders = await orderService.getOrders(req.user._id);
  if (orders) {
    return res.status(httpStatus.OK).json({ success: true, orders });
  }
  res.status(httpStatus.OK).json({ success: true, message: 'No Order Found' });
});

/**
 * Add orders
 * @route POST /api/v1/orders
 * @access Public/User
 */
export const addOrders = asyncHandler(async (req: Request, res: Response) => {
  await validate(req.body, orderSchema);

  //@ts-ignore
  const result = await cartService.deleteCartByUserId(req.user._id);
  const orderObj = req.body as OrderDocument;
  const order = await orderService.createOrder({
    //@ts-ignore
    user: req.user._id,
    ...orderObj,
  });

  res.status(httpStatus.CREATED).json({ success: true, order });
});
