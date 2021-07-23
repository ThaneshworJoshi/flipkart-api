import { Router } from 'express';
import { createReview, updateReview, deleteReview } from '../../../controllers/review.controller';
import { isUser, requireSignin } from '../../../middlewares/auth';

const router = Router();

router
  .route('/')
  .post(requireSignin, isUser, createReview)
  .put(requireSignin, isUser, updateReview)
  .delete(requireSignin, isUser, deleteReview);

export default router;
