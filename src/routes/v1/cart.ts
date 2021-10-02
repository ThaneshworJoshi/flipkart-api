import { Router } from 'express';
import { addProductToCart, getCartItems } from '../../controllers/cart.controller';
import { isUser, requireSignin } from '../../middlewares/auth';

const router = Router();

router.route('/').get(requireSignin, isUser, getCartItems);
router.route('/add-to-cart').post(requireSignin, isUser, addProductToCart);
router.route('/removeItem').post(requireSignin, isUser, removeCartItem)
export default router;