import { Request, response, Response } from 'express';
import { asyncHandler } from '../middlewares/async';
import { cartService } from '../services';
import * as httpStatus from 'http-status-codes';
import { CartDocument } from '../models/cart.model';

/**
 * Add item to a cart
 * @route POST /api/v1/cart
 * @access Public/User
 */
export const addProductToCart = asyncHandler(async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = req.user._id;
  const cart = await cartService.getCartByUserId(userId);

  if (cart) {
    let cartUpdatePromises: Array<CartDocument | any> = [];

    //@ts-ignore
    req.body.cartItems.forEach((cartItem) => {
      const productId = cartItem.product;
      //@ts-ignore
      const item = cart.cartItems.find((c) => c.product == productId);
      let condition, update;

      if (item) {
        condition = { user: userId, 'cartItems.product': productId };
        update = {
          $set: {
            'cartItems.$': cartItem,
          },
        };
      } else {
        condition = { user: userId };
        update = {
          $push: {
            cartItems: cartItem,
          },
        };
      }
      cartUpdatePromises.push(cartService.updateCart(condition, update));
    });
    Promise.all(cartUpdatePromises)
      .then((result) => {
        res.status(httpStatus.OK).json({ success: true, message: 'Cart Updated Successfully' });
      })
      .catch((error) => res.status(httpStatus.BAD_REQUEST).json({ success: false, error: error.message }));
  } else {
    // Create a new Cart document
    const cartItems = req.body.cartItems;
    //@ts-ignore
    const cart = await cartService.createNewCart(userId, cartItems);
    res.status(httpStatus.CREATED).json({ success: true, cart });
  }
});

/**
 * Get items from cart
 * @route GET /api/v1/cart
 * @access Public/User
 */
export const getCartItems = asyncHandler(async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = req.user._id;
  //@ts-ignore
  const cart = await cartService.getCartProductsByUserId(userId);

  if (cart) {
    let cartItems: any = {};
    cart.cartItems.forEach((item: object, index: number) => {
      //@ts-ignore
      cartItems[item.product._id.toString()] = {
        //@ts-ignore
        _id: item.product._id,
        //@ts-ignore
        name: item.product.name,
        //@ts-ignore
        img: item.product.productPictures[0].img,
        //@ts-ignore
        price: item.product.price,
        //@ts-ignore
        qty: item.quantity,
      };
    });
    return res.json({ success: true, data: cartItems });
  }

  res.json({ success: true, message: 'Empty Cart' });
});
