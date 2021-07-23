import { Router } from 'express';
import { getOrders, addOrders } from '../../controllers/order.controller';
import { isUser, requireSignin } from '../../middlewares/auth';

const router = Router();

router.route('/').get(requireSignin, isUser, getOrders).post(requireSignin, isUser, addOrders);

export default router;
