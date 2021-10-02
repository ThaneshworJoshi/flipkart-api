import { Router } from 'express';
import {
  login,
  registerUser,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
} from '../../../controllers/auth.controller';
import { isUser, requireSignin } from '../../../middlewares/auth';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(login);
router.route('/logout').post(requireSignin, isUser, logout);
router.route('/refresh-token').post(refreshTokens);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);
router.route('/send-verification-email').post(sendVerificationEmail);
router.route('/verify-email').post(verifyEmail);

export default router;
