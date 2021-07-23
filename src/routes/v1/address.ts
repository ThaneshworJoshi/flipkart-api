import { Router } from 'express';
import { addAddress, getAddress } from '../../controllers/address.controller';
import { isUser, requireSignin } from '../../middlewares/auth';

const router = Router();

router.route('/').post(requireSignin, isUser, getAddress);
router.route('/create').post(requireSignin, isUser, addAddress);
export default router;
