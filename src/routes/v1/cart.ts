import { Router } from 'express';
import { addProductToCart, getCartItems } from '../../controllers/cart.controller';
import { isUser, requireSignin } from '../../middlewares/auth';

const router = Router();

router.route('/').get(requireSignin, isUser, getCartItems).post(requireSignin, isUser, addProductToCart);

export default router;
